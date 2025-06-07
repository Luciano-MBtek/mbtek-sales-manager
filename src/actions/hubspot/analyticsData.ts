"use server";

import { hsFetch } from "@/lib/hubspotFetch";
import { getHubspotOwnerIdSession } from "@/actions/user/getHubspotOwnerId";

export type ContactLeadInfo = {
  createdate: string;
  lead_owner_id?: string | null;
};

export async function getContactsAndLeadsInRange(
  fromISO: string,
  toISO: string
) {
  const ownerId = await getHubspotOwnerIdSession();
  const contacts: ContactLeadInfo[] = [];
  let after: string | undefined;
  do {
    const body = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "createdate",
              operator: "BETWEEN",
              value: fromISO,
              highValue: toISO,
            },
          ],
        },
      ],
      properties: ["createdate", "lead_owner_id"],
      sorts: ["createdate"],
      limit: 200,
      ...(after ? { after } : {}),
    };

    const page = await hsFetch<{
      paging?: { next?: { after: string } };
      results: Array<{
        properties: { createdate: string; lead_owner_id?: string | null };
      }>;
    }>("/crm/v3/objects/contacts/search", {
      method: "POST",
      next: { tags: [`contacts`], revalidate: 3600 },
      body: JSON.stringify(body),
    });

    contacts.push(...page.results.map((r) => r.properties));
    after = page.paging?.next?.after;
  } while (after);

  return { ownerId, contacts };
}

export type DealInfo = { createdate: string };

export async function getDealsInRange(fromISO: string, toISO: string) {
  const ownerId = await getHubspotOwnerIdSession();
  const deals: DealInfo[] = [];
  let after: string | undefined;

  do {
    const body = {
      filterGroups: [
        {
          filters: [
            { propertyName: "lead_owner_id", operator: "EQ", value: ownerId },
            {
              propertyName: "createdate",
              operator: "BETWEEN",
              value: fromISO,
              highValue: toISO,
            },
          ],
        },
      ],
      properties: ["createdate"],
      sorts: ["createdate"],
      limit: 200,
      ...(after ? { after } : {}),
    };

    const page = await hsFetch<{
      paging?: { next?: { after: string } };
      results: Array<{ properties: { createdate: string } }>;
    }>("/crm/v3/objects/deals/search", {
      method: "POST",
      next: { tags: [`deals`], revalidate: 3600 },
      body: JSON.stringify(body),
    });

    deals.push(...page.results.map((r) => r.properties));
    after = page.paging?.next?.after;
  } while (after);

  return deals;
}

const chunk = <T>(arr: T[], size = 100) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, (i + 1) * size)
  );

export type QualificationInfo = { createdate: string; diffMs: number };

export async function getQualificationTimesInRange(
  fromISO: string,
  toISO: string
) {
  const ownerId = await getHubspotOwnerIdSession();
  const ids: string[] = [];
  let after: string | undefined;

  type SearchResp = {
    paging?: { next: { after: string } };
    results: { id: string }[];
  };

  do {
    const body = {
      filterGroups: [
        {
          filters: [
            { propertyName: "lead_owner_id", operator: "EQ", value: ownerId },
            {
              propertyName: "createdate",
              operator: "BETWEEN",
              value: fromISO,
              highValue: toISO,
            },
          ],
        },
      ],
      properties: ["createdate"],
      limit: 200,
      sorts: ["createdate"],
      ...(after ? { after } : {}),
    };

    const page = await hsFetch<SearchResp>("/crm/v3/objects/contacts/search", {
      method: "POST",
      next: { tags: [`contacts`], revalidate: 3600 },
      body: JSON.stringify(body),
    });

    ids.push(...page.results.map((r) => r.id));
    after = page.paging?.next?.after;
  } while (after);

  if (ids.length === 0) return [] as QualificationInfo[];

  const results: QualificationInfo[] = [];
  const chunks = chunk(ids);

  await Promise.all(
    chunks.map(async (chunkIds, chunkIndex) => {
      const body = {
        limit: chunkIds.length,
        properties: ["createdate", "hs_object_id"],
        propertiesWithHistory: ["lead_owner_id"],
        inputs: chunkIds.map((id) => ({ id })),
      };

      try {
        const data = await hsFetch<{
          results: Array<{
            properties: { createdate: string; hs_object_id: string };
            propertiesWithHistory: {
              lead_owner_id: { value: string; timestamp: string }[];
            };
          }>;
        }>("/crm/v3/objects/contacts/batch/read", {
          method: "POST",
          next: { tags: [`contacts`], revalidate: 3600 },
          body: JSON.stringify(body),
        });

        for (const c of data.results) {
          const created = Date.parse(c.properties.createdate);

          if (
            !c.propertiesWithHistory?.lead_owner_id ||
            c.propertiesWithHistory.lead_owner_id.length === 0
          ) {
            continue;
          }

          const historyItems = c.propertiesWithHistory.lead_owner_id.filter(
            (v) => v.value === ownerId
          );

          if (historyItems.length === 0) {
            continue;
          }

          const first = [...historyItems].sort(
            (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
          )[0];

          if (first) {
            const assignedMs = Date.parse(first.timestamp);
            const diffMs = assignedMs - created;
            results.push({ createdate: c.properties.createdate, diffMs });
          }
        }
      } catch (error) {
        console.error(`Error processing chunk ${chunkIndex}:`, error);
      }
    })
  );

  return results;
}
