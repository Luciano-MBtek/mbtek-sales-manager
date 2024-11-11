"use server";

import { revalidatePath } from "next/cache";

export async function searchContact(
  value: string,
  propertyType: "email" | "phone"
) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

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
              filters: [
                {
                  propertyName: propertyType,
                  operator: "CONTAINS_TOKEN",
                  value: `*${value}`,
                },
              ],
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

    revalidatePath("/contacts");

    if (data.total === 0) {
      return 0;
    }
    return data.results[0] || null;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw new Error("Failed to fetch contact");
  }
}
