"use server";

import pLimit from "p-limit";
import { engagementProperties } from "./utils";
import {
  getAllTimeDateRange,
  getCurrentMonthDateRange,
  getCurrentWeekDateRange,
} from "@/lib/utils";
import {
  Engagement,
  ContactData,
  Associations,
} from "@/components/LeadActivities/utils";
import { getHubspotOwnerIdSession } from "../user/getHubspotOwnerId";

const ASSOC_TYPES = ["contacts", "companies", "deals"] as const;
const CONTACT_BATCH_SIZE = 100;
const ENGAGEMENT_BATCH_SIZE = 100;
const API = "https://api.hubapi.com";
const limiter = pLimit(6);

// TYPES -------------------------------------------------------------------
interface Association {
  id: string;
  type: string;
}

// HELPERS -----------------------------------------------------------------
const hubFetch = (
  url: string,
  init: RequestInit = {},
  revalidate: number = 60
) =>
  fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    next: { revalidate },
  });

const chunk = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// SEARCH FUNCTIONS --------------------------------------------------------
async function searchEngagementIds(
  ownerId: string,
  timeRange: "weekly" | "monthly" | "allTime" = "weekly",
  after?: string
) {
  if (!process.env.HUBSPOT_API_KEY) throw new Error("Missing HUBSPOT_API_KEY");

  const { startDate, endDate } =
    timeRange === "monthly"
      ? getCurrentMonthDateRange()
      : timeRange === "allTime"
        ? getAllTimeDateRange()
        : getCurrentWeekDateRange();

  const limit = 200;
  const searchBody = {
    properties: ["hs_object_id"],
    filterGroups: [
      {
        filters: [
          { propertyName: "hubspot_owner_id", operator: "EQ", value: ownerId },
          {
            propertyName: "hs_createdate",
            operator: "BETWEEN",
            value: startDate,
            highValue: endDate,
          },
          {
            propertyName: "hs_engagement_type",
            operator: "NEQ",
            value: "TASK",
          },
          {
            propertyName: "hs_engagement_type",
            operator: "NEQ",
            value: "MEETING",
          },
        ],
      },
    ],
    sorts: ["-hs_createdate"],
    limit,
    ...(after ? { after } : {}),
  };

  const searchRes = await hubFetch(
    `${API}/crm/v3/objects/engagements/search`,
    { method: "POST", body: JSON.stringify(searchBody) },
    60
  );

  if (!searchRes.ok) throw new Error("search error " + searchRes.statusText);

  return await searchRes.json();
}

// BATCH FUNCTIONS --------------------------------------------------------
async function getEngagementsBatch(engagementIds: string[]) {
  if (engagementIds.length === 0) {
    return { results: [] };
  }

  const idChunks = chunk(engagementIds, ENGAGEMENT_BATCH_SIZE);

  const batchResults = await Promise.all(
    idChunks.map((ids) =>
      limiter(async () => {
        const response = await hubFetch(
          `${API}/crm/v3/objects/engagements/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({
              properties: engagementProperties,
              inputs: ids.map((id) => ({ id })),
            }),
          },
          300
        );

        if (!response.ok) {
          throw new Error(`Engagements batch error: ${response.statusText}`);
        }

        return await response.json();
      })
    )
  );

  return {
    results: batchResults.flatMap((batch) => batch.results),
  };
}

// MAIN --------------------------------------------------------------------
async function getOwnerEngagements(
  ownerId: string,
  timeRange: "weekly" | "monthly" | "allTime" = "weekly",
  after?: string
): Promise<{ engagements: Engagement[]; nextAfter?: string }> {
  // 1️⃣ Buscar IDs de engagements -----------------------------------------
  const idData = await searchEngagementIds(ownerId, timeRange, after);

  if (idData.total === 0) {
    return { engagements: [], nextAfter: undefined };
  }

  const engagementIds = idData.results.map((eng: any) => eng.id);
  const nextAfter = idData.paging?.next?.after;

  // 2️⃣ Obtener datos completos de engagements en batch ------------------
  const engagementsData = await getEngagementsBatch(engagementIds);
  const engagements: Engagement[] = engagementsData.results;

  if (engagements.length === 0) {
    return { engagements: [], nextAfter };
  }

  // 3️⃣ ASSOCIATIONS BATCH -------------------------------------------------
  // mapa engagementId -> Associations
  const assocMap = new Map<string, Associations>();
  engagements.forEach((e) => {
    assocMap.set(e.id, { contacts: [], companies: [], deals: [] });
  });

  await Promise.all(
    ASSOC_TYPES.map((type) =>
      limiter(async () => {
        const assocRes = await hubFetch(
          `${API}/crm/v3/associations/engagements/${type}/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({
              inputs: engagements.map((e) => ({ id: e.id })),
            }),
          },
          300
        );
        if (!assocRes.ok) {
          console.error("assoc batch error:", type, assocRes.statusText);
          return;
        }
        const { results } = await assocRes.json();
        results.forEach((row: any) => {
          const list = row.to as Association[];
          const currentAssoc = assocMap.get(row.from.id);
          if (currentAssoc) {
            currentAssoc[type] = list;
            assocMap.set(row.from.id, currentAssoc);
          }
        });
      })
    )
  );

  // 4️⃣ CONTACTS BATCH -----------------------------------------------------
  const contactIds = Array.from(
    new Set(
      engagements.flatMap(
        (e) => assocMap.get(e.id)?.contacts.map((c) => c.id) ?? []
      )
    )
  );

  const contactMap = new Map<string, ContactData>();

  if (contactIds.length > 0) {
    await Promise.all(
      chunk(contactIds, CONTACT_BATCH_SIZE).map((chunkIds) =>
        limiter(async () => {
          const cRes = await hubFetch(
            `${API}/crm/v3/objects/contacts/batch/read`,
            {
              method: "POST",
              body: JSON.stringify({
                properties: [
                  "firstname",
                  "lastname",
                  "email",
                  "hs_lead_status",
                ],
                inputs: chunkIds.map((id) => ({ id })),
              }),
            },
            300
          );
          if (!cRes.ok) {
            console.error("contacts batch error:", cRes.statusText);
            return;
          }
          const { results } = await cRes.json();
          results.forEach((c: ContactData) => contactMap.set(c.id, c));
        })
      )
    );
  }

  // 4️⃣.5️⃣ DEALS BATCH -----------------------------------------------------
  const dealIds = Array.from(
    new Set(
      engagements.flatMap(
        (e) => assocMap.get(e.id)?.deals.map((d) => d.id) ?? []
      )
    )
  );

  const dealMap = new Map<string, any>();

  if (dealIds.length > 0) {
    await Promise.all(
      chunk(dealIds, CONTACT_BATCH_SIZE).map((chunkIds) =>
        limiter(async () => {
          const dRes = await hubFetch(
            `${API}/crm/v3/objects/deals/batch/read`,
            {
              method: "POST",
              body: JSON.stringify({
                properties: [
                  "amount",
                  "closedate",
                  "createdate",
                  "dealname",
                  "dealstage",
                  "hs_lastmodifieddate",
                  "pipeline",
                ],
                inputs: chunkIds.map((id) => ({ id })),
              }),
            },
            300
          );
          if (!dRes.ok) {
            console.error("deals batch error:", dRes.statusText);
            return;
          }
          const { results } = await dRes.json();
          results.forEach((d: any) => dealMap.set(d.id, d));
        })
      )
    );
  }

  // 5️⃣ ENRICH + RETURN ----------------------------------------------------
  const enriched: Engagement[] = engagements.map((e) => {
    const assoc = assocMap.get(e.id)!;
    return {
      ...e,
      associations: assoc,
      contactsData: assoc.contacts
        .map((c) => contactMap.get(c.id)!)
        .filter(Boolean),
      dealsData: assoc.deals.map((d) => dealMap.get(d.id)).filter(Boolean),
    };
  });

  return { engagements: enriched, nextAfter };
}

// PUBLIC WRAPPER -----------------------------------------------------------
export async function getLeadsBatchActivities(
  timeRange: "weekly" | "monthly" | "allTime" = "weekly",
  after?: string,
  hubspotOwnerId?: string
) {
  const ownerId = hubspotOwnerId ?? (await getHubspotOwnerIdSession());
  //const ownerId = "719106449"; // Byron (test)
  return getOwnerEngagements(ownerId, timeRange, after);
}
