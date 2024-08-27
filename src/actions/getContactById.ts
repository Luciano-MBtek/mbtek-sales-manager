"use server";

import { propertyNameMap } from "@/components/steps/utils";

const properties = Object.keys(propertyNameMap);

export async function GetContactById(id: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;
    const propertiesQuery = properties.join(",");
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${id}?properties=${propertiesQuery}`,
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
    return data || null;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw new Error("Failed to fetch contact");
  }
}
