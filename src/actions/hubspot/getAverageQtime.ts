// src/actions/hubspot/getAverageQualificationTime.ts
"use server";
import { hsFetch } from "@/lib/hubspotFetch";

import { getHubspotOwnerIdSession } from "@/actions/user/getHubspotOwnerId";

//─────────────────────────────────────────────────────────  HELPERS
const chunk = <T>(arr: T[], size = 100) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, (i + 1) * size)
  );

//─────────────────────────────────────────────────────────  ACTION
export async function getAverageQualificationTime(
  fromISO?: string,
  toISO?: string
) {
  /* 1️⃣  owner & rango  */
  const ownerId = await getHubspotOwnerIdSession();
  //const ownerId = "719106449"; // Byron
  if (!ownerId) throw new Error("No HubSpot owner id");

  const now = new Date();
  const start = new Date(
    fromISO ?? new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const end = new Date(toISO ?? now);
  const range = { from: start.toISOString(), to: end.toISOString() };

  /* 2️⃣  IDs de contactos que ya tienen lead_owner_id  */
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
              value: range.from,
              highValue: range.to,
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
      body: JSON.stringify(body),
    });

    ids.push(...page.results.map((r) => r.id));
    after = page.paging?.next?.after;
  } while (after);

  if (ids.length === 0) {
    return { displayValue: 0, unit: "Minutes" };
  }

  /* 3️⃣  Batch-read con historial y promedio on-the-fly  */
  let totalMs = 0,
    count = 0;

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

            totalMs += diffMs;
            count += 1;
          }
        }
      } catch (error) {
        console.error(`Error processing chunk ${chunkIndex}:`, error);
      }
    })
  );

  if (!count) {
    return { displayValue: 0, unit: "Minutes" };
  }

  /* 4️⃣  formato amigable  */
  const avgMs = totalMs / count;

  const mins = +(avgMs / 60_000).toFixed(1);
  const hours = +(avgMs / 3_600_000).toFixed(1);
  const days = +(avgMs / 86_400_000).toFixed(2);

  const result =
    days >= 1
      ? { displayValue: days, unit: "Days" }
      : hours >= 1
        ? { displayValue: hours, unit: "Hours" }
        : { displayValue: mins, unit: "Minutes" };

  return result;
}
