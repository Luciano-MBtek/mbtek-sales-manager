"use server";

import { patchContactProperty } from "./patchContactProperty";

export async function getOwnerById(id: string, contactId?: string) {
  const URL = `https://api.hubapi.com/crm/v3/owners/${id}`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    } else if (response.status === 404) {
      console.warn(`Owner with ID ${id} not found in HubSpot`);

      if (contactId) {
        try {
          await patchContactProperty(contactId, "hubspot_owner_id", "", false);
          console.log(`Cleared owner ID for contact ${contactId}`);
        } catch (patchError) {
          console.error("Error clearing owner ID:", patchError);
        }
      }
      return null;
    } else {
      const data = await response.json();
      return { error: "Failed to retrieve data", details: data };
    }
  } catch (error) {
    console.error("Error fetching Hubspot owner:", error);
    return null;
  }
}
