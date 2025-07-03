"use server";

import { revalidateTag } from "next/cache";

export async function deleteLineItems(lineItemIds: string[]) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const deletePromises = lineItemIds.map(async (lineItemId) => {
      const deleteResponse = await fetch(
        `https://api.hubapi.com/crm/v3/objects/line_item/${lineItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!deleteResponse.ok) {
        throw new Error(
          `Failed to delete line item ${lineItemId}: ${deleteResponse.status}`
        );
      }

      return lineItemId;
    });

    const deleted = await Promise.all(deletePromises);

    revalidateTag("contact-deals");

    return {
      deleted: deleted.length,
      ids: deleted,
    };
  } catch (error) {
    console.error("Error deleting line items:", error);
    throw new Error(
      `Failed to delete line items: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
