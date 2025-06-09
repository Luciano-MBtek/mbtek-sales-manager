"use server";

import { getHubspotOwnerIdSession } from "@/actions/user/getHubspotOwnerId";
import {
  getCurrentWeekDateRange,
  getCurrentMonthDateRange,
  getAllTimeDateRange,
} from "@/lib/utils";

const leadQualificationProperties = [
  // Step 1 - Basic contact info
  "createdate",
  "firstname",
  "lastname",
  "email",
  "phone",
  "country_us_ca",
  "state_usa",
  "province_territory",
  "zip",
  "city",
  "address",
  "lead_type",
  "hear_about_us",
  "current_situation",
  "looking_for",
  "lead_owner_id",
  "hs_lead_status",
  "hubspot_owner_id",

  // Step 2 - Project details
  "building_type",
  "project_type",
  "current_system_type",
  "system_age",
  "main_project_goals",
  "competitors_previously_contacted",
  "competitors_name",

  // Step 3 - Timing
  "desired_timeframe",
  "decisive_timing_factor",
  "other_timing_factor",

  // Step 4 - Decision making
  "decision_making_status",
  "property_type",
  "type_of_decision",
  "additional_comments",

  // Step 5 - Budget
  "defined_a_budget",
  "budget_range",
  "aware_of_available_financial_incentives",
  "planned_financial_method",

  // step 6
  "bant_score",

  // step 7

  "shipping_address",
  "shipping_city",
  "shipping_state",
  "shipping_province",
  "shipping_zip_code",
  "shipping_country",
  "shipping_notes",
];

async function leadsQualified(userId: string, timeRange: string = "weekly") {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    let startDateISO, endDateISO;

    // Select date range based on timeRange parameter
    if (timeRange === "monthly") {
      const dateRange = getCurrentMonthDateRange();
      startDateISO = dateRange.startDate;
      endDateISO = dateRange.endDate;
    } else if (timeRange === "allTime") {
      const dateRange = getAllTimeDateRange();
      startDateISO = dateRange.startDate;
      endDateISO = dateRange.endDate;
    } else {
      // Default to weekly
      const dateRange = getCurrentWeekDateRange();
      startDateISO = dateRange.startDate;
      endDateISO = dateRange.endDate;
    }

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["qualify-lead"],
        },
        body: JSON.stringify({
          properties: leadQualificationProperties,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "lead_owner_id",
                  operator: "EQ",
                  value: userId,
                },
                {
                  propertyName: "hs_lead_status",
                  operator: "EQ",
                  value: "OPEN_DEAL",
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
          limit: 200,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error("Error fetching owned contacts:", error);
    throw new Error("Failed to fetch owned contacts");
  }
}

export async function getQualifiedLeads(timeRange: string = "weekly") {
  const userId = await getHubspotOwnerIdSession();
  // const userId = "719106449"; // Byron
  return leadsQualified(userId, timeRange);
}
