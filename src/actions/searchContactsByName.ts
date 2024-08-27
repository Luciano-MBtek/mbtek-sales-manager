"use server";

export async function searchContacts(firstname?: string, lastname?: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const filters = [];

    if (firstname && lastname) {
      // Prioritize the search with both firstname and lastname
      filters.push(
        {
          propertyName: "firstname",
          operator: "CONTAINS_TOKEN",
          value: firstname,
        },
        {
          propertyName: "lastname",
          operator: "CONTAINS_TOKEN",
          value: lastname,
        }
      );
    } else if (firstname) {
      // If only firstname is provided
      filters.push({
        propertyName: "firstname",
        operator: "CONTAINS_TOKEN",
        value: firstname,
      });
    } else if (lastname) {
      // If only lastname is provided
      filters.push({
        propertyName: "lastname",
        operator: "CONTAINS_TOKEN",
        value: lastname,
      });
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
          filterGroups: [
            {
              filters: filters,
            },
          ],
          properties: [
            "hs_record_id",
            "firstname",
            "lastname",
            "phone",
            "email",
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.total === 0) {
      return 0;
    }
    return data.results || null;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw new Error("Failed to fetch contact");
  }
}
