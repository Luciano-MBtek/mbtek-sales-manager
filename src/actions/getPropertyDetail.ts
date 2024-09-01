"use server";

export async function GetPropertyDetail(property: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/properties/contacts/${property}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `HubSpot API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching property:", error);

    throw new Error(
      `Failed to fetch property: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
