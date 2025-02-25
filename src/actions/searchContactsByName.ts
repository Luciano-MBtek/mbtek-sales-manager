"use server";

export async function searchContacts(searchValue: string) {
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
        body: JSON.stringify({
          filterGroups: filterGroups,
          properties: [
            "hs_record_id",
            "firstname",
            "lastname",
            "phone",
            "email",
          ],
          limit: 25,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (trimmedSearch.includes(" ")) {
      const [firstName, lastName] = trimmedSearch.split(" ").filter(Boolean);
      if (firstName && lastName) {
        const matches = data.results.filter(
          (contact: any) =>
            contact.properties.firstname
              ?.toLowerCase()
              .includes(firstName.toLowerCase()) &&
            contact.properties.lastname
              ?.toLowerCase()
              .includes(lastName.toLowerCase())
        );

        return matches.length > 0 ? matches : data.results || null;
      }
    }

    if (data.total === 0) {
      return 0;
    }
    return data.results || null;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw new Error("Failed to fetch contact");
  }
}
