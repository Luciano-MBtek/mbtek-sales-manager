"use server";
import { Ticket, OwnerData } from "@/types/ticketTypes";

import { getOwnerById } from "./getOwnerById";

const apiKey = process.env.HUBSPOT_API_KEY;

export async function getTicketsFromContacts(contactId: string) {
  try {
    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/associations/contacts/tickets/batch/read`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["tickets"],
          revalidate: 300,
        },
        body: JSON.stringify({
          inputs: [
            {
              id: `${contactId}`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "COMPLETE") {
      if (!data.results || data.results.length === 0) {
        return [];
      }

      const tickets = data.results[0].to as { id: string }[];

      // Verificar si hay tickets antes de continuar
      if (!tickets || tickets.length === 0) {
        return [];
      }

      const mappedTickets = tickets.map((e) => ({ id: e.id }));

      const readTickets = await fetch(
        "https://api.hubapi.com/crm/v3/objects/tickets/batch/read",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          next: {
            tags: ["tickets"],
            revalidate: 300,
          },
          body: JSON.stringify({
            properties: [
              "subject",
              "content",
              "hs_ticket_priority",
              "createdate",
              "hs_pipeline",
              "hs_pipeline_stage",
              "source_type",
              "hubspot_owner_id",
              "hs_ticket_category",
            ],
            inputs: mappedTickets,
          }),
        }
      );
      if (!readTickets.ok) {
        throw new Error(`HubSpot API error: ${readTickets.statusText}`);
      }
      const ticketsData = await readTickets.json();

      const uniqueOwnerIds = [
        ...new Set(
          ticketsData.results
            .map((ticket: Ticket) => ticket.properties?.hubspot_owner_id)
            .filter((id: unknown): id is string => typeof id === "string")
        ),
      ];

      const ownersMap = new Map<string, OwnerData>();

      for (const ownerId of uniqueOwnerIds) {
        const ownerData = (await getOwnerById(ownerId as string)) as OwnerData;
        if (ownerData && !ownerData.error) {
          ownersMap.set(ownerId as string, ownerData);
        }
      }

      const extendedTickets = ticketsData.results.map((ticket: Ticket) => {
        const ownerId = ticket.properties?.hubspot_owner_id;
        return {
          ...ticket,
          owner: ownerId ? ownersMap.get(ownerId) || null : null,
        };
      });

      return extendedTickets;
    }

    return [];
  } catch (error) {
    console.error("Error fetching tickets from Contact:", error);
    throw new Error("Failed to fetch tickets from Contact");
  }
}
