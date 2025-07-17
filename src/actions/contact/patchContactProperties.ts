"use server";

import { ContactFormValues } from "@/types/quick-quote/contactTypes";
import { revalidatePath } from "next/cache";

export async function patchContactProperties(
  contactId: string,
  properties: Partial<ContactFormValues>
): Promise<any> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error(
        "HUBSPOT_API_KEY is not defined in the environment variables."
      );
    }

    const body = {
      properties,
    };

    console.log("body", body);

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error updating the Contact: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const contactData = await response.json();

    revalidatePath("/contacts");
    return contactData;
  } catch (error) {
    console.error("Error in patchContactProperties:", error);
    throw new Error(
      `Failed to update the Contact: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
