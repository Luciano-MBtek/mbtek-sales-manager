"use server";

import { revalidatePath, revalidateTag } from "next/cache";

const URL = "https://api.hubapi.com/crm/v3/objects";

// First erase the quote and after the deal.

export async function deleteQuote(quoteId: string): Promise<any> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error(
        "HUBSPOT_API_KEY is not defined in the environment variables."
      );
    }

    const associatedDeal = await fetch(
      URL + `/quotes/${quoteId}/associations/deal`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!associatedDeal.ok) {
      const errorData = await associatedDeal.json();
      throw new Error(
        `Error getting Deal: ${associatedDeal.status} - ${associatedDeal.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const deal = await associatedDeal.json();

    if (!deal.results || deal.results.length === 0) {
      throw new Error("No deals associated to quote");
    }

    const dealId = deal.results[0].id;

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

    const deleteDeal = await fetch(URL + `/deals/${dealId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!deleteDeal.ok) {
      const errorData = await deleteDeal.json();
      throw new Error(
        `Error deleting Deal: ${deleteDeal.status} - ${deleteDeal.statusText} - ${JSON.stringify(errorData)}`
      );
    }
    revalidatePath(`/contacts/*`);
    revalidateTag("quotes");
    revalidateTag("deals");
    revalidateTag("contact-deals");

    return { success: true };
  } catch (error) {
    console.error("Error in deleting Quote and Deal:", error);
    throw new Error(
      `Failed to delete Quote and Deal: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
