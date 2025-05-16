"use server";

import { revalidatePath } from "next/cache";
import { triggerLeadQualificationWebhook } from "./webhooks/leadQualificationWebhook";
import { createContactProperties } from "@/lib/utils";
import { StepQualificationOneFormValues } from "@/schemas/leadQualificationSchema";

export async function createContact(
  contact: StepQualificationOneFormValues,
  ownerId: string
) {
  const properties = createContactProperties(contact, ownerId);

  try {
    const apiKey = process.env.HUBSPOT_API_KEY;
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    // await triggerLeadQualificationWebhook(data.id);

    revalidatePath("/contacts");

    return {
      success: true,
      contactId: data.id,
      properties: data.properties,
    };
  } catch (error) {
    console.error("Error creating contact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create contact",
    };
  }
}
