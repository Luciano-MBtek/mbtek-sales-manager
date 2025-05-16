"use server";

export async function GetContactOwner(id: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${id}?properties=hubspot_owner_id`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.properties?.hubspot_owner_id || null;
  } catch (error) {
    console.error("Error fetching contact owner:", error);
    throw new Error("Failed to fetch contact owner");
  }
}
