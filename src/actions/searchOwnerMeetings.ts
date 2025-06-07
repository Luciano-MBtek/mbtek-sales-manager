"use server";
import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";
import { Meeting } from "@/types/meetingTypes";

async function searchOwnerMeetings(userId: string) {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error("HUBSPOT_API_KEY is not defined");
    }
    let allMeetings: Meeting[] = [];

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/meetings/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        /* next: {
          tags: ["meetings"],
          revalidate: 1,
        }, */

        body: JSON.stringify({
          filters: [
            {
              propertyName: "hubspot_owner_id",
              operator: "EQ",
              value: userId,
            },
          ],
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

          limit: 50,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();
    allMeetings = [...data.results];

    return allMeetings;
  } catch (error) {
    console.error("Error fetching Meetings:", error);
    throw new Error("Failed to fetch Meetings");
  }
}

export async function getAllOwnersMeetings() {
  const userId = await getHubspotOwnerIdSession();

  // const userId = "719106449";
  return searchOwnerMeetings(userId);
}
