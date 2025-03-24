"use server";
import { revalidateTag } from "next/cache";
import { updateTicketSchemaType } from "@/schemas/ticketSchema";

export async function updateTicket(data: updateTicketSchemaType) {
  try {
    const {
      name,
      pipeline,
      status,
      category,
      description,
      source,
      owner,
      priority,
      contactId,
      ticketId,
    } = data;

    const apiKey = process.env.HUBSPOT_API_KEY;

    const properties = {
      hs_pipeline: pipeline,
      hs_pipeline_stage: status,
      hs_ticket_priority: priority,
      subject: name,
      content: description,
      hubspot_owner_id: owner,
      hs_ticket_category:
        Array.isArray(category) && category.length > 0
          ? category.join(";")
          : category,
      source_type: source,
    };

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/tickets/${ticketId}`,
      {
        method: "PATCH",
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
      const errorData = await response.json();
      throw new Error(
        `HubSpot API error: ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const responseData = await response.json();

    revalidateTag("tickets");

    return {
      success: true,
      ticketId: responseData.id,
      properties: responseData.properties,
    };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while updating ticket",
    };
  }
}
