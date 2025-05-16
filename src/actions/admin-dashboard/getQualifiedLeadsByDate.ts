"use server";

async function leadsCount(
  startDateISO: string,
  endDateISO: string,
  ownerId?: string
): Promise<number> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    const filters = [
      {
        propertyName: "hs_lead_status",
        operator: "NEQ",
        value: "Disqualified",
      },
      {
        propertyName: "createdate",
        operator: "BETWEEN",
        value: startDateISO,
        highValue: endDateISO,
      },
    ];

    if (ownerId) {
      filters.push({
        propertyName: "hubspot_owner_id",
        operator: "EQ",
        value: ownerId,
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
        next: {
          revalidate: 250,
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: filters,
            },
          ],
          limit: 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.total;
  } catch (error) {
    console.error("Error fetching owned contacts:", error);
    throw new Error("Failed to fetch owned contacts");
  }
}

export async function getQualifiedLeadsByDate(
  startDateISO: string,
  endDateISO: string,
  ownerId?: string
): Promise<number> {
  return leadsCount(startDateISO, endDateISO, ownerId);
}
