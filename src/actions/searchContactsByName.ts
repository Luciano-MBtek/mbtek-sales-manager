"use server";
import { Contact } from "@/types";
import { revalidatePath } from "next/cache";

// First function to get just the IDs of contacts
async function searchContactIds(searchValue: string) {
  const trimmedSearch = searchValue.trim();
  let firstNameSearch = trimmedSearch;
  let lastNameSearch = trimmedSearch;

  if (trimmedSearch.includes(" ")) {
    const [firstName, lastName] = trimmedSearch.split(" ").filter(Boolean);
    if (firstName && lastName) {
      firstNameSearch = firstName;
      lastNameSearch = lastName;
    }
  }

  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    const filterGroups = [
      {
        filters: [
          {
            propertyName: "firstname",
            operator: "CONTAINS_TOKEN",
            value: firstNameSearch,
          },
        ],
      },
      {
        filters: [
          {
            propertyName: "lastname",
            operator: "CONTAINS_TOKEN",
            value: lastNameSearch,
          },
        ],
      },
      {
        filters: [
          {
            propertyName: "email",
            operator: "CONTAINS_TOKEN",
            value: searchValue,
          },
        ],
      },
      {
        filters: [
          {
            propertyName: "phone",
            operator: "CONTAINS_TOKEN",
            value: searchValue,
          },
        ],
      },
    ];

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
          filterGroups: filterGroups,
          properties: ["hs_object_id"],
          limit: 200,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching contact IDs:", error);
    throw new Error("Failed to fetch contact IDs");
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
                "hs_record_id",
                "firstname",
                "lastname",
                "company",
                "hs_lead_status",
                "phone",
                "email",
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

export async function searchContacts(searchValue: string) {
  try {
    // Step 1: Get contact IDs
    const idData = await searchContactIds(searchValue);

    if (idData.total === 0) {
      return 0;
    }

    // Step 2: Extract just the IDs from the results
    const contactIds = idData.results.map((contact: Contact) => contact.id);

    // Step 3: Get full contact details in batch
    const contactsData = await getContactsBatch(contactIds);

    // Apply additional filtering for first and last name if needed
    const trimmedSearch = searchValue.trim();
    if (trimmedSearch.includes(" ")) {
      const [firstName, lastName] = trimmedSearch.split(" ").filter(Boolean);
      if (firstName && lastName) {
        const matches: Contact[] | Contact = contactsData.results.filter(
          (contact: any) =>
            contact.properties.firstname
              ?.toLowerCase()
              .includes(firstName.toLowerCase()) &&
            contact.properties.lastname
              ?.toLowerCase()
              .includes(lastName.toLowerCase())
        );
        const contacts: Contact[] = contactsData.results;

        return matches.length > 0 ? matches : contacts || null;
      }
    }

    revalidatePath("/contacts/*");
    return contactsData.results || null;
  } catch (error) {
    console.error("Error searching contacts:", error);
    throw new Error("Failed to search contacts");
  }
}
