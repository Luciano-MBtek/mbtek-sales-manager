"use server";

import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";

// First function to get just the IDs of contacts
async function searchOwnedContactIds(userId: string, after?: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 250,
        },
        body: JSON.stringify({
          properties: ["hs_object_id"],
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "hubspot_owner_id",
                  operator: "EQ",
                  value: userId,
                },
              ],
            },
          ],
          sorts: ["-createdate"],
          limit: 200,
          after: after,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching owned contact IDs:", error);
    throw new Error("Failed to fetch owned contact IDs");
  }
}

// Helper function to chunk array into smaller arrays
function chunk(array: any[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

// Second function to get the full contact details using batch API
async function getContactsBatch(contactIds: string[]) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    if (contactIds.length === 0) {
      return { results: [] };
    }

    // Split ids into chunks of 100 (HubSpot batch limit)
    const BATCH_SIZE = 100;
    const idChunks = chunk(contactIds, BATCH_SIZE);

    // Process each chunk with a batch request
    const batchResults = await Promise.all(
      idChunks.map(async (ids) => {
        const response = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/batch/read`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              properties: [
                "createdate",
                "email",
                "firstname",
                "hs_object_id",
                "address",
                "lastmodifieddate",
                "lastname",
                "phone",
                "company",
                "lead_type",
                "total_revenue",
              ],
              inputs: ids.map((id) => ({ id })),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HubSpot batch API error: ${response.statusText}`);
        }

        return await response.json();
      })
    );

    // Combine results from all batch requests
    const combinedResults = {
      results: batchResults.flatMap((batch) => batch.results),
    };

    return combinedResults;
  } catch (error) {
    console.error("Error fetching contacts batch:", error);
    throw new Error("Failed to fetch contacts batch");
  }
}

export async function getContactsByOwnerId(
  after?: string,
  hubspotOwnerId?: string
) {
  const userId = hubspotOwnerId ?? (await getHubspotOwnerIdSession());
  //const managerIdTest = "719106449";

  // Step 1: Get contact IDs
  const idData = await searchOwnedContactIds(userId, after);

  // Step 2: Extract just the IDs from the results
  const contactIds = idData.results.map((contact: any) => contact.id);

  // Step 3: Get full contact details in batch
  const contactsData = await getContactsBatch(contactIds);

  // Step 4: Return with the same structure as before for compatibility
  return {
    ...idData,
    results: contactsData.results,
  };
}

// New function to search contacts by term
export async function searchContactsByTerm(
  searchTerm: string,
  hubspotOwnerId?: string
) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;
    const userId = hubspotOwnerId ?? (await getHubspotOwnerIdSession());

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    // Build owner filter
    const ownerFilter = {
      propertyName: "hubspot_owner_id",
      operator: "EQ",
      value: userId,
    };

    // Define the filter type
    type PropertyFilter = {
      propertyName: string;
      operator: string;
      value: string;
    };

    // Determine search type based on input pattern
    const trimmedSearch = searchTerm.trim();
    let searchFilters: PropertyFilter[] = [];

    // Check if search includes @ symbol (email search)
    if (trimmedSearch.includes("@")) {
      searchFilters = [
        {
          propertyName: "email",
          operator: "CONTAINS_TOKEN",
          value: trimmedSearch,
        },
      ];
    }
    // Check if search contains only digits (phone search)
    else if (/^\d+$/.test(trimmedSearch.replace(/[-()\s]/g, ""))) {
      searchFilters = [
        {
          propertyName: "phone",
          operator: "CONTAINS_TOKEN",
          value: trimmedSearch,
        },
      ];
    }
    // Check if search contains space (first name + last name)
    else if (trimmedSearch.includes(" ")) {
      const [firstName, lastName] = trimmedSearch.split(" ").filter(Boolean);
      if (firstName && lastName) {
        searchFilters = [
          {
            propertyName: "firstname",
            operator: "CONTAINS_TOKEN",
            value: firstName,
          },
          {
            propertyName: "lastname",
            operator: "CONTAINS_TOKEN",
            value: lastName,
          },
        ];
      }
    }
    // Default case - search across multiple fields
    else {
      searchFilters = [
        {
          propertyName: "firstname",
          operator: "CONTAINS_TOKEN",
          value: trimmedSearch,
        },
      ];
    }

    // Create filter groups based on the search type
    let filterGroups = [];

    // For first name + last name search, we need AND logic between firstname and lastname
    if (trimmedSearch.includes(" ") && searchFilters.length === 2) {
      filterGroups = [
        {
          filters: [ownerFilter, ...searchFilters],
        },
      ];
    }
    // For other searches, use OR logic between different property searches
    else {
      filterGroups = searchFilters.map((filter) => ({
        filters: [ownerFilter, filter],
      }));
    }

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: [
            "createdate",
            "email",
            "firstname",
            "hs_object_id",
            "address",
            "lastmodifieddate",
            "lastname",
            "phone",
            "company",
            "lead_type",
            "total_revenue",
          ],
          filterGroups: filterGroups,
          limit: 100,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching contacts:", error);
    throw new Error("Failed to search contacts");
  }
}
