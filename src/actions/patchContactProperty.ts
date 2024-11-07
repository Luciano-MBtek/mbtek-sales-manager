"use server";
import { revalidatePath } from "next/cache";

export async function patchContactProperty(
  id: string,
  property: string,
  value: string
) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const body = JSON.stringify({
      properties: {
        [property]: value,
      },
    });

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body,
      }
    );

    if (!response.ok) {
      throw new Error(
        `HubSpot API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    revalidatePath(`/contacts/${id}`);

    return data;
  } catch (error) {
    console.error("Error updating contact property:", error);

    throw new Error(
      `Failed to update contact property: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
