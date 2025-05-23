"use server";

import { getHubspotOwnerIdSession } from "@/actions/user/getHubspotOwnerId";
import { getCurrentWeekDateRange } from "@/lib/utils";

async function leadsCount(userId: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    const { startDate: startDateISO, endDate: endDateISO } =
      getCurrentWeekDateRange();

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 250,
        },
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
                  value: startDateISO,
                  highValue: endDateISO,
                },
              ],
            },
          ],
          sorts: ["-createdate"],
          limit: 100,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.total;
  } catch (error) {
    console.error("Error fetching owned contacts:", error);
    throw new Error("Failed to fetch owned contacts");
  }
}

export async function getLeadsCount() {
  const userId = await getHubspotOwnerIdSession();
  // const managerIdTest = "719106449"; // Byron
  return leadsCount(userId);
}
