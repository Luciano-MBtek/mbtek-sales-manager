"use server";
import { revalidatePath } from "next/cache";

export async function patchContactProperties(
  id: string,
  properties: Record<string, string | undefined>
) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const body = JSON.stringify({
      properties,
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
      const errorText = await response.text();
      console.error("HubSpot error details:", errorText);
      throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    revalidatePath(`/contacts/${id}`);
    revalidatePath(`/contacts/${id}/properties`);

    return data;
  } catch (error) {
    console.error("Error updating contact property:", error);

    throw new Error(
      `Failed to update contact property: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
