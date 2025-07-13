"use server";

import pLimit from "p-limit";
import {
  getCurrentDayDateRange,
  getCurrentMonthDateRange,
  getCurrentWeekDateRange,
} from "@/lib/utils";
import { getHubspotOwnerIdSession } from "../user/getHubspotOwnerId";
import { Association, Associations, ContactData, Task } from "@/types/Tasks";

// CONFIG ------------------------------------------------------------------
const CONTACT_BATCH_SIZE = 100;
const API = "https://api.hubapi.com";
const limiter = pLimit(6);

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

// Task properties to retrieve
const taskProperties = [
  "hs_task_subject",
  "hs_task_status",
  "hs_task_priority",
  "hs_task_body",
  "hs_createdate",
  "hs_timestamp",
  "hs_lastmodifieddate",
  "hubspot_owner_id",
  "hs_task_type",
];

// MAIN --------------------------------------------------------------------
async function getOwnerTasks(
  ownerId: string,
  timeRange: "daily" | "weekly" | "monthly" = "weekly",
  after?: string,
  fromDate?: string,
  toDate?: string
): Promise<{ tasks: Task[]; nextAfter?: string }> {
  if (!process.env.HUBSPOT_API_KEY) throw new Error("Missing HUBSPOT_API_KEY");

  // 1️⃣ Date range ---------------------------------------------------------
  let startDate: string;
  let endDate: string;

  if (fromDate && toDate) {
    startDate = new Date(fromDate).toISOString();
    endDate = new Date(toDate).toISOString();
  } else {
    const dateRange =
      timeRange === "daily"
        ? getCurrentDayDateRange()
        : timeRange === "monthly"
          ? getCurrentMonthDateRange()
          : getCurrentWeekDateRange();

    startDate = dateRange.startDate;
    endDate = dateRange.endDate;
  }

  // 2️⃣ SEARCH -------------------------------------------------------------
  const limit = 50;
  const searchBody = {
    properties: taskProperties,
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
    `${API}/crm/v3/objects/tasks/search`,
    { method: "POST", body: JSON.stringify(searchBody) },
    60
  );

  if (!searchRes.ok) throw new Error("search error " + searchRes.statusText);
  const searchJson = await searchRes.json();
  const tasks: Task[] = searchJson.results;

  const nextAfter = searchJson.paging?.next?.after;

  if (tasks.length === 0) return { tasks: [], nextAfter: undefined };

  // 3️⃣ ASSOCIATIONS BATCH -------------------------------------------------
  // Map taskId -> Associations
  const assocMap = new Map<string, Associations>();
  tasks.forEach((t) => {
    assocMap.set(t.id, { contacts: [], companies: [], deals: [] });
  });

  const ASSOC_TYPES = ["contacts", "companies", "deals"] as const;
  await Promise.all(
    ASSOC_TYPES.map((type) =>
      limiter(async () => {
        const assocRes = await hubFetch(
          `${API}/crm/v3/associations/tasks/${type}/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({
              inputs: tasks.map((t) => ({ id: t.id })),
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
      tasks.flatMap((t) => assocMap.get(t.id)?.contacts.map((c) => c.id) ?? [])
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
  const enriched: Task[] = tasks.map((t) => {
    const assoc = assocMap.get(t.id)!;
    return {
      ...t,
      associations: assoc,
      contactsData: assoc.contacts
        .map((c) => contactMap.get(c.id)!)
        .filter(Boolean),
    };
  });

  return { tasks: enriched, nextAfter };
}

// PUBLIC WRAPPER -----------------------------------------------------------

export async function getUserBatchTasks(
  timeRange: "daily" | "weekly" | "monthly" = "weekly",
  after?: string,
  fromDate?: string,
  toDate?: string,
  hubspotOwnerId?: string
) {
  try {
    const ownerId = hubspotOwnerId ?? (await getHubspotOwnerIdSession());
    //const ownerId = "719106449"; // Byron
    return getOwnerTasks(ownerId, timeRange, after, fromDate, toDate);
  } catch (error) {
    console.error("Error in getUserBatchTasks:", error);
    throw new Error(
      "Failed to fetch user tasks: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
