"use server";
import { Deal, Contact } from "@/app/mydeals/deals";
import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";
import { dealStage, pipelineLabels } from "@/app/mydeals/utils";

const HS_TOKEN = process.env.HUBSPOT_API_KEY!;
const HS_HEADERS = {
  Authorization: `Bearer ${HS_TOKEN}`,
  "Content-Type": "application/json",
};

const PAGE_LIMIT = 100;

/** 1. Fetch all the owner's deals and return the deals with their properties */
async function fetchDealsWithProperties(ownerId: string): Promise<Deal[]> {
  let after: string | undefined;
  const deals: Deal[] = [];

  do {
    const res = await fetch(
      "https://api.hubapi.com/crm/v3/objects/deals/search",
      {
        method: "POST",
        headers: HS_HEADERS,
        next: { tags: [`deals`], revalidate: 300 },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "hubspot_owner_id",
                  operator: "EQ",
                  value: ownerId,
                },
                {
                  propertyName: "pipeline",
                  operator: "NEQ",
                  value: pipelineLabels["Shopify prior (June 2025)"],
                },
                {
                  propertyName: "dealstage",
                  operator: "NEQ",
                  value: dealStage["Closed Won"],
                },
                {
                  propertyName: "dealstage",
                  operator: "NEQ",
                  value: dealStage["Closed Lost"],
                },
                //Avoid retrieve deals from old pipeline (Shopify prior (June 2025)) , lost and won.
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
          limit: PAGE_LIMIT,
          after,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`HubSpot API error: ${res.statusText}`);
    }

    const data = await res.json();
    deals.push(...data.results);
    after = data.paging?.next?.after;
  } while (after);

  return deals;
}

/** 2. Retrieves contacts associated with a batch of deals */
async function fetchContactIdsForDeals(
  dealIds: string[]
): Promise<Map<string, string[]>> {
  const res = await fetch(
    "https://api.hubapi.com/crm/v4/associations/deal/contact/batch/read",
    {
      method: "POST",
      headers: HS_HEADERS,
      next: { tags: [`deals`], revalidate: 300 },
      body: JSON.stringify({ inputs: dealIds.map((id) => ({ id })) }),
    }
  );

  if (!res.ok) {
    throw new Error(
      `HubSpot API error fetching associations: ${res.statusText}`
    );
  }

  const data = await res.json();
  const map = new Map<string, string[]>();

  data.results.forEach((row: any) => {
    map.set(
      row.from.id,
      row.to.map((t: any) => t.toObjectId)
    );
  });

  return map;
}

/** 3. Fetches the properties of a batch of contacts */
async function fetchContacts(
  contactIds: string[]
): Promise<Record<string, Contact>> {
  if (contactIds.length === 0) return {};

  const res = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts/batch/read",
    {
      method: "POST",
      headers: HS_HEADERS,
      next: { tags: [`deals`], revalidate: 300 },
      body: JSON.stringify({
        properties: ["firstname", "lastname"],
        inputs: contactIds.map((id) => ({ id })),
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`HubSpot API error fetching contacts: ${res.statusText}`);
  }

  const data = await res.json();
  return Object.fromEntries(
    data.results.map((c: any) => [
      c.id,
      {
        id: c.id,
        firstname: c.properties.firstname,
        lastname: c.properties.lastname,
      },
    ])
  );
}

/** 4. Main function that returns deals enriched with contacts */
export async function searchOwnerDeals(ownerId: string): Promise<Deal[]> {
  try {
    const deals = await fetchDealsWithProperties(ownerId);
    const dealIds = deals.map((deal) => deal.id);

    const chunks = Array.from(
      { length: Math.ceil(dealIds.length / PAGE_LIMIT) },
      (_, i) => dealIds.slice(i * PAGE_LIMIT, (i + 1) * PAGE_LIMIT)
    );

    const dealsById = Object.fromEntries(
      deals.map((deal) => [deal.id, { ...deal, contacts: [] as Contact[] }])
    );

    for (const dealChunk of chunks) {
      const assocMap = await fetchContactIdsForDeals(dealChunk);

      const uniqueContactIds = [...new Set([...assocMap.values()].flat())];
      const contactsById = await fetchContacts(uniqueContactIds);

      dealChunk.forEach((id) => {
        const contactIds = assocMap.get(id) || [];
        dealsById[id].contacts = contactIds
          .map((cid) => contactsById[cid])
          .filter(Boolean);
      });
    }

    return Object.values(dealsById);
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw new Error("Failed to fetch deals");
  }
}

export async function getDealsByUserId(hubspotOwnerId?: string) {
  const userId = hubspotOwnerId ?? (await getHubspotOwnerIdSession());
  //const userId = "79900767"; // Brian test
  return searchOwnerDeals(userId);
}
