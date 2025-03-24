"use server";
import { revalidateTag } from "next/cache";
import { ticketSchemaType } from "@/schemas/ticketSchema";

export async function createTicket(ticketProperties: ticketSchemaType) {
  const {
    name,
    pipeline,
    status,
    category,
    description,
    source,
    owner,
    priority,
    createDate,
    contactId,
  } = ticketProperties;

  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const properties = {
      hs_pipeline: pipeline,
      hs_pipeline_stage: status,
      hs_ticket_priority: priority,
      subject: name,
      content: description,
      hubspot_owner_id: owner,
      createdate: createDate ? new Date(createDate).getTime() : undefined,
      hs_ticket_category: category.length > 0 ? category.join(";") : undefined,
      source_type: source,
    };

    const associations = contactId
      ? [
          {
            to: {
              id: contactId,
            },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 16,
              },
            ],
          },
        ]
      : [];

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/tickets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties,
          associations,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HubSpot API error: ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    revalidateTag("tickets");

    return {
      success: true,
      ticketId: data.id,
      properties: data.properties,
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create ticket",
    };
  }
}
