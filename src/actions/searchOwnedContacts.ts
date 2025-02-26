"use server";

import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";

async function searchOwnedContacts(userId: string, after?: string) {
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
          limit: 25,
          after: after,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching owned contacts:", error);
    throw new Error("Failed to fetch owned contacts");
  }
}

export async function getContactsByOwnerId(after?: string) {
  const userId = await getHubspotOwnerIdSession();
  //const managerIdTest = "719106449";
  return searchOwnedContacts(userId, after);
}
