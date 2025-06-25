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

export type DealsWonLost = { won: number; lost: number };

export async function getOwnerDealsWonLost(pipeline?: string): Promise<DealsWonLost> {
  const ownerId = await getHubspotOwnerIdSession();
  let after: string | undefined;
  const summary = { won: 0, lost: 0 };

  const filters: Array<{ propertyName: string; operator: string; value: string }> = [
    { propertyName: "hubspot_owner_id", operator: "EQ", value: ownerId },
    { propertyName: "pipeline", operator: "NEQ", value: OLD_PIPELINE_ID },
  ];

  if (pipeline && pipeline !== "all") {
    filters.push({ propertyName: "pipeline", operator: "EQ", value: pipeline });
  }

  do {
    const body = {
      filterGroups: [{ filters }],
      properties: ["dealstage"],
      limit: PAGE_LIMIT,
      ...(after ? { after } : {}),
    };

    const data = await hsFetch<{
      paging?: { next?: { after: string } };
      results: Array<{ properties: { dealstage: string } }>;
    }>("/crm/v3/objects/deals/search", {
      method: "POST",
      next: { tags: ["deals-won-lost"], revalidate: 300 },
      body: JSON.stringify(body),
    });

    data.results.forEach(({ properties }) => {
      const stage = properties.dealstage;
      if (WON_STAGES.includes(stage)) summary.won++;
      else if (LOST_STAGES.includes(stage)) summary.lost++;
    });

    after = data.paging?.next?.after;
  } while (after);

  return summary;
}
