"use server";
import { Deal, Contact } from "@/app/mydeals/deals";
import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";

interface EnrichedDeal extends Deal {}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchOwnerDeals(userId: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }
    let allDeals: Deal[] = [];

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/deals/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: { tags: [`deals`], revalidate: 300 },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "hubspot_owner_id",
                  operator: "EQ",
                  value: userId,
                },
              ],
            },
          ],
          properties: [
            "amount",
            "closedate",
            "createdate",
            "dealname",
            "dealstage",
            "hs_lastmodifieddate",
            "pipeline",
          ],
          sorts: ["-createdate"],
          limit: 50,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();
    allDeals = [...allDeals, ...data.results];

    const enrichedDeals: EnrichedDeal[] = await Promise.all(
      allDeals.map(async (deal) => {
        const dealId = deal.id;

        const associationsResponse = await fetch(
          `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/contacts`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            next: { tags: [`deals`], revalidate: 300 },
          }
        );

        if (!associationsResponse.ok) {
          console.error(
            `Error fetching associations for deal ${dealId}: ${associationsResponse.statusText}`
          );
          return { ...deal, contacts: [] };
        }

        const associationsData = await associationsResponse.json();
        const contactIds: string[] = associationsData.results.map(
          (assoc: any) => assoc.id
        );

        const contacts: Contact[] = await Promise.all(
          contactIds.map(async (contactId) => {
            await delay(100);
            const contactResponse = await fetch(
              `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                next: { tags: [`deals`], revalidate: 300 },
              }
            );

            if (!contactResponse.ok) {
              console.error(
                `Error fetching contact data for ${contactId}: ${contactResponse.statusText}`
              );
              return { id: contactId };
            }

            const contactData = await contactResponse.json();
            return {
              id: contactData.id,
              firstname: contactData.properties.firstname,
              lastname: contactData.properties.lastname,
            };
          })
        );

        return { ...deal, contacts };
      })
    );

    return enrichedDeals;
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw new Error("Failed to fetch deals");
  }
}

export async function getDealsByUserId() {
  const userId = await getHubspotOwnerIdSession();
  // const managerIdTest = "376406301";
  return searchOwnerDeals(userId);
}
