"use server";
import { revalidateTag } from "next/cache";

export async function deleteTicket(ticketId: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/tickets/${ticketId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HubSpot API error: ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    revalidateTag("tickets");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete ticket",
    };
  }
}
