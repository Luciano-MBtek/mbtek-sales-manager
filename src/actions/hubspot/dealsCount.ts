"use server";

import { getHubspotOwnerIdSession } from "@/actions/user/getHubspotOwnerId";
import { getCurrentWeekDateRange } from "@/lib/utils";
import { hsFetch } from "@/lib/hubspotFetch";

async function dealsCount(
  userId: string,
  startDateISO?: string,
  endDateISO?: string
) {
  try {
    // default
    const dateRange =
      startDateISO && endDateISO
        ? { startDate: startDateISO, endDate: endDateISO }
        : getCurrentWeekDateRange();

    const data = await hsFetch<{ total: number }>(
      `/crm/v3/objects/deals/search`,
      {
        method: "POST",
        body: JSON.stringify({
          properties: ["createdate"],
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "lead_owner_id",
                  operator: "EQ",
                  value: userId,
                },
                {
                  propertyName: "createdate",
                  operator: "BETWEEN",
                  value: dateRange.startDate,
                  highValue: dateRange.endDate,
                },
              ],
            },
          ],
          limit: 0,
        }),
      }
    );

    return data.total;
  } catch (error) {
    console.error("Error fetching owned contacts:", error);
    throw new Error("Failed to fetch owned contacts");
  }
}

export async function getDealsCount(fromDate?: string, toDate?: string) {
  const userId = await getHubspotOwnerIdSession();
  //const managerIdTest = "719106449"; // Byron
  return dealsCount(userId, fromDate, toDate);
}
