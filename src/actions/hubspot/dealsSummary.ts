"use server";

import { hsFetch } from "@/lib/hubspotFetch";
import { getHubspotOwnerIdSession } from "@/actions/user/getHubspotOwnerId";
import { dealStage } from "@/app/mydeals/utils";

const PAGE_LIMIT = 200;
const OLD_PIPELINE_ID = "75e28846-ad0d-4be2-a027-5e1da6590b98";

const WON_STAGES = [
  dealStage["Closed Won"],
  dealStage["Closed Won - Complete System"],
];
const LOST_STAGES = [
  dealStage["Closed Lost"],
  dealStage["Closed Lost - Complete System"],
];

export type DealsSummary = {
  open: number;
  won: number;
  lost: number;
  conversionRate: number;
};

export async function getOwnerDealsSummary(): Promise<DealsSummary> {
  const ownerId = await getHubspotOwnerIdSession();
  // const ownerId = "719106449"; //Byron test
  let after: string | undefined;
  const summary = { open: 0, won: 0, lost: 0 };

  do {
    const body = {
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
              value: OLD_PIPELINE_ID,
            },
          ],
        },
      ],
      properties: ["dealstage"],
      limit: PAGE_LIMIT,
      ...(after ? { after } : {}),
    };

    const data = await hsFetch<{
      paging?: { next?: { after: string } };
      results: Array<{ properties: { dealstage: string } }>;
    }>("/crm/v3/objects/deals/search", {
      method: "POST",
      next: { tags: [`deals-summary`], revalidate: 300 },
      body: JSON.stringify(body),
    });

    data.results.forEach(({ properties }) => {
      const stage = properties.dealstage;
      if (WON_STAGES.includes(stage)) summary.won++;
      else if (LOST_STAGES.includes(stage)) summary.lost++;
      else summary.open++;
    });

    after = data.paging?.next?.after;
  } while (after);

  const total = summary.open + summary.won + summary.lost;
  const conversionRate = total ? (summary.won / total) * 100 : 0;

  return { ...summary, conversionRate };
}

// Add this type to your existing types
export type DealsWonLostOverTime = {
  date: string;
  won: number;
  lost: number;
};

export async function getDealsWonLostOverTime(
  pipeline?: string
): Promise<DealsWonLostOverTime[]> {
  const ownerId = "719106449"; // Using Byron test as in your code
  let after: string | undefined;
  const dealsData: Array<{
    stage: string;
    modifiedDate: Date;
  }> = [];

  const filters: Array<{
    propertyName: string;
    operator: string;
    value: string;
  }> = [
    { propertyName: "hubspot_owner_id", operator: "EQ", value: ownerId },
    { propertyName: "pipeline", operator: "NEQ", value: OLD_PIPELINE_ID },
  ];

  if (pipeline && pipeline !== "all") {
    filters.push({ propertyName: "pipeline", operator: "EQ", value: pipeline });
  }

  do {
    const body = {
      filterGroups: [{ filters }],
      properties: ["dealstage", "createdate"],
      limit: PAGE_LIMIT,
      ...(after ? { after } : {}),
    };

    const data = await hsFetch<{
      paging?: { next?: { after: string } };
      results: Array<{
        properties: {
          dealstage: string;
          createdate: string;
        };
      }>;
    }>("/crm/v3/objects/deals/search", {
      method: "POST",
      next: { tags: ["deals-over-time"], revalidate: 300 },
      body: JSON.stringify(body),
    });

    data.results.forEach(({ properties }) => {
      const stage = properties.dealstage;
      if (WON_STAGES.includes(stage) || LOST_STAGES.includes(stage)) {
        dealsData.push({
          stage: properties.dealstage,
          modifiedDate: new Date(properties.createdate),
        });
      }
    });

    after = data.paging?.next?.after;
  } while (after);

  // Sort by date
  dealsData.sort((a, b) => a.modifiedDate.getTime() - b.modifiedDate.getTime());

  // Group by month
  const monthlyData: Map<string, { won: number; lost: number }> = new Map();

  for (const deal of dealsData) {
    const monthKey = deal.modifiedDate.toISOString().substring(0, 7); // YYYY-MM format
    const monthName = new Date(monthKey + "-01").toLocaleString("default", {
      month: "short",
    });
    const yearShort = deal.modifiedDate.getFullYear().toString().slice(2);
    const displayKey = `${monthName} '${yearShort}`;

    if (!monthlyData.has(displayKey)) {
      monthlyData.set(displayKey, { won: 0, lost: 0 });
    }

    const record = monthlyData.get(displayKey)!;

    if (WON_STAGES.includes(deal.stage)) {
      record.won++;
    } else if (LOST_STAGES.includes(deal.stage)) {
      record.lost++;
    }
  }

  // Convert to array sorted by date
  return Array.from(monthlyData.entries()).map(([date, data]) => ({
    date,
    won: data.won,
    lost: data.lost,
  }));
}
