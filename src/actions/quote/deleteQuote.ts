"use server";

import { revalidatePath, revalidateTag } from "next/cache";

const URL = "https://api.hubapi.com/crm/v3/objects";

export async function deleteQuote(quoteId: string): Promise<any> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error(
        "HUBSPOT_API_KEY is not defined in the environment variables."
      );
    }

    const deleteQuote = await fetch(URL + `/quotes/${quoteId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!deleteQuote.ok) {
      const errorData = await deleteQuote.json();
      throw new Error(
        `Error deleting the Quote: ${deleteQuote.status} - ${deleteQuote.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    revalidatePath(`/contacts/*`);
    revalidateTag("quotes");
    revalidateTag("contact-deals");

    return { success: true };
  } catch (error) {
    console.error("Error in deleting Quote:", error);
    throw new Error(
      `Failed to delete Quote: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
