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

// CONFIG ------------------------------------------------------------------
const ASSOC_TYPES = ["contacts", "companies", "deals"] as const;
const CONTACT_BATCH_SIZE = 100;
const API = "https://api.hubapi.com";
const limiter = pLimit(6); // max 6 concurrent requests (~60 rps)

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

// MAIN --------------------------------------------------------------------
async function getOwnerEngagements(
  ownerId: string,
  timeRange: "weekly" | "monthly" | "allTime" = "weekly",
  after?: string
): Promise<{ engagements: Engagement[]; nextAfter?: string }> {
  if (!process.env.HUBSPOT_API_KEY) throw new Error("Missing HUBSPOT_API_KEY");

  // 1️⃣ rango de fechas ----------------------------------------------------
  const { startDate, endDate } =
    timeRange === "monthly"
      ? getCurrentMonthDateRange()
      : timeRange === "allTime"
        ? getAllTimeDateRange()
        : getCurrentWeekDateRange();

  // 2️⃣ SEARCH -------------------------------------------------------------
  const limit = 50;
  const searchBody = {
    properties: engagementProperties,
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
  const searchJson = await searchRes.json();
  const engagements: Engagement[] = searchJson.results;
  const nextAfter = searchJson.paging?.next?.after;

  if (engagements.length === 0)
    return { engagements: [], nextAfter: undefined };

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
  await Promise.all(
    chunk(contactIds, CONTACT_BATCH_SIZE).map((chunkIds) =>
      limiter(async () => {
        const cRes = await hubFetch(
          `${API}/crm/v3/objects/contacts/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({
              properties: ["firstname", "lastname", "email", "hs_lead_status"],
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

  // 5️⃣ ENRICH + RETURN ----------------------------------------------------
  const enriched: Engagement[] = engagements.map((e) => {
    const assoc = assocMap.get(e.id)!;
    return {
      ...e,
      associations: assoc,
      contactsData: assoc.contacts
        .map((c) => contactMap.get(c.id)!)
        .filter(Boolean),
    };
  });

  return { engagements: enriched, nextAfter };
}

// PUBLIC WRAPPER -----------------------------------------------------------
export async function getLeadsBatchActivities(
  timeRange: "weekly" | "monthly" | "allTime" = "weekly",
  after?: string
) {
  const ownerId = await getHubspotOwnerIdSession();
  //const ownerId = "719106449"; // Byron (test)
  return getOwnerEngagements(ownerId, timeRange, after);
}
