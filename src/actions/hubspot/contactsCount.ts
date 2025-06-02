"use server";

import { getCurrentWeekDateRange } from "@/lib/utils";
import { hsFetch } from "@/lib/hubspotFetch";

async function contactsCount(startDateISO?: string, endDateISO?: string) {
  try {
    const dateRange =
      startDateISO && endDateISO
        ? { startDate: startDateISO, endDate: endDateISO }
        : getCurrentWeekDateRange();

    const data = await hsFetch<{ total: number }>(
      `/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        body: JSON.stringify({
          properties: ["createdate"],
          filterGroups: [
            {
              filters: [
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

export async function getContactsCount(fromDate?: string, toDate?: string) {
  return contactsCount(fromDate, toDate);
}
