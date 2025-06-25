"use server";
import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";
import { Meeting } from "@/types/meetingTypes";

async function searchMeetingIds(userId: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/meetings/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["meetings"],
          revalidate: 300,
        },
        body: JSON.stringify({
          filters: [
            {
              propertyName: "hubspot_owner_id",
              operator: "EQ",
              value: userId,
            },
          ],
          properties: ["hs_object_id"],
          limit: 200,
          sorts: [
            {
              propertyName: "hs_createdate",
              direction: "DESCENDING",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meeting IDs:", error);
    throw new Error("Failed to fetch meeting IDs");
  }
}

function chunk(array: any[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

async function getMeetingsBatch(meetingIds: string[]) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }

    if (meetingIds.length === 0) {
      return { results: [] };
    }

    // Dividir IDs en chunks de 100 (límite de HubSpot batch)
    const BATCH_SIZE = 100;
    const idChunks = chunk(meetingIds, BATCH_SIZE);

    // Procesar cada chunk con una solicitud batch
    const batchResults = await Promise.all(
      idChunks.map(async (ids) => {
        const response = await fetch(
          `https://api.hubapi.com/crm/v3/objects/meetings/batch/read`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            next: {
              tags: ["meetings"],
              revalidate: 300,
            },
            body: JSON.stringify({
              properties: [
                "hs_createdate",
                "hs_lastmodifieddate",
                "hs_object_id",
                "hs_attendee_owner_ids",
                "hs_booking_instance_id",
                "hs_contact_first_outreach_date",
                "hs_created_by_scheduling_page",
                "hs_external_calendar_id",
                "hs_guest_emails",
                "hs_i_cal_uid",
                "hs_include_description_in_reminder",
                "hs_internal_meeting_notes",
                "hs_meeting_body",
                "hs_meeting_calendar_event_hash",
                "hs_meeting_change_id",
                "hs_meeting_created_from_link_id",
                "hs_meeting_end_time",
                "hs_meeting_external_url",
                "hs_meeting_location",
                "hs_meeting_location_type",
                "hs_meeting_ms_teams_payload",
                "hs_meeting_notetaker_id",
                "hs_meeting_outcome",
                "hs_meeting_payments_session_id",
                "hs_meeting_pre_meeting_prospect_reminders",
                "hs_meeting_source",
                "hs_meeting_source_id",
                "hs_meeting_start_time",
                "hs_meeting_title",
                "hs_meeting_transcript",
                "hs_meeting_web_conference_meeting_id",
                "hs_roster_object_coordinates",
                "hs_scheduled_tasks",
                "hs_time_to_book_meeting_from_first_contact",
                "hs_timezone",
                "hs_video_conference_url",
              ],
              inputs: ids.map((id) => ({ id })),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HubSpot batch API error: ${response.statusText}`);
        }

        return await response.json();
      })
    );

    const combinedResults = {
      results: batchResults.flatMap((batch) => batch.results),
    };

    return combinedResults;
  } catch (error) {
    console.error("Error fetching meetings batch:", error);
    throw new Error("Failed to fetch meetings batch");
  }
}

export async function searchOwnerMeetings(userId: string) {
  try {
    const idData = await searchMeetingIds(userId);

    if (idData.total === 0) {
      return [];
    }

    const meetingIds = idData.results.map((meeting: Meeting) => meeting.id);

    const meetingsData = await getMeetingsBatch(meetingIds);

    return meetingsData.results || [];
  } catch (error) {
    console.error("Error searching meetings:", error);
    throw new Error("Failed to search meetings");
  }
}

export async function getAllOwnersMeetings() {
  const userId = await getHubspotOwnerIdSession();
  // const userId = "719106449";
  return searchOwnerMeetings(userId);
}
