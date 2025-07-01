"use server";

import pLimit from "p-limit";
import { Meeting } from "@/types/meetingTypes";
import { getHubspotOwnerIdSession } from "./user/getHubspotOwnerId";

type Associations = { contacts: { id: string }[] };
type ContactData = {
  id: string;
  properties: { firstname?: string; lastname?: string; email?: string };
};

export interface MeetingWithContacts extends Meeting {
  associations: Associations;
  contactsData: ContactData[];
}

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const API = "https://api.hubapi.com";
const MEETING_BATCH_SIZE = 100; // HubSpot batch limit
const CONTACT_BATCH_SIZE = 100;
const limiter = pLimit(6); // stay well below burst limit (10 r/s)

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
const hubFetch = (
  url: string,
  init: RequestInit = {},
  revalidate: number = 300
) =>
  fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    next: { revalidate }, // lets you keep Next.js caching behaviour
  });

const chunk = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// ---------------------------------------------------------------------------
// 1️⃣  SEARCH – just return the ids we care about
// ---------------------------------------------------------------------------
async function searchMeetingIds(ownerId: string) {
  const body = {
    filters: [
      { propertyName: "hubspot_owner_id", operator: "EQ", value: ownerId },
    ],
    properties: ["hs_object_id"],
    sorts: [{ propertyName: "hs_createdate", direction: "DESCENDING" }],
    limit: 200,
  };

  const res = await hubFetch(`${API}/crm/v3/objects/meetings/search`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("meeting search: " + res.statusText);
  return res.json(); // { results: [{id:"…"…}], total, paging? }
}

// ---------------------------------------------------------------------------
// 2️⃣  BATCH READ MEETINGS
// ---------------------------------------------------------------------------
const meetingProperties = [
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
];

async function getMeetingsBatch(meetingIds: string[]) {
  const results = await Promise.all(
    chunk(meetingIds, MEETING_BATCH_SIZE).map((ids) =>
      limiter(async () => {
        const res = await hubFetch(
          `${API}/crm/v3/objects/meetings/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({
              properties: meetingProperties,
              inputs: ids.map((id) => ({ id })),
            }),
          }
        );
        if (!res.ok) throw new Error("meeting batch: " + res.statusText);
        const { results } = await res.json();
        return results as Meeting[];
      })
    )
  );
  return results.flat();
}

// ---------------------------------------------------------------------------
// 3️⃣  BATCH READ ASSOCIATIONS  (meetings → contacts)
// ---------------------------------------------------------------------------
async function getMeetingContactAssociations(meetingIds: string[]) {
  const assocMap = new Map<string, { contacts: { id: string }[] }>();
  meetingIds.forEach((id) => assocMap.set(id, { contacts: [] }));

  await Promise.all(
    chunk(meetingIds, MEETING_BATCH_SIZE).map((ids) =>
      limiter(async () => {
        const res = await hubFetch(
          `${API}/crm/v3/associations/meetings/contacts/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({ inputs: ids.map((id) => ({ id })) }),
          },
          300
        );
        if (!res.ok) throw new Error("assoc batch: " + res.statusText);
        const { results } = await res.json(); // [{ from:{id}, to:[{id}] }]
        results.forEach((row: any) => {
          assocMap.set(row.from.id, { contacts: row.to });
        });
      })
    )
  );

  return assocMap;
}

// ---------------------------------------------------------------------------
// 4️⃣  BATCH READ CONTACTS
// ---------------------------------------------------------------------------
const contactProps = ["firstname", "lastname", "email"];

async function getContacts(contactIds: string[]) {
  const contactMap = new Map<string, any>();

  await Promise.all(
    chunk(contactIds, CONTACT_BATCH_SIZE).map((ids) =>
      limiter(async () => {
        const res = await hubFetch(
          `${API}/crm/v3/objects/contacts/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({
              properties: contactProps,
              inputs: ids.map((id) => ({ id })),
            }),
          }
        );
        if (!res.ok) throw new Error("contacts batch: " + res.statusText);
        const { results } = await res.json();
        results.forEach((c: any) => contactMap.set(c.id, c));
      })
    )
  );

  return contactMap;
}

// ---------------------------------------------------------------------------
// 5️⃣  PUBLIC ENTRY – owner → meetings (with contacts)
// ---------------------------------------------------------------------------
export async function searchOwnerMeetings(ownerId: string) {
  // -- ids ------------------------------------------------------
  const idData = await searchMeetingIds(ownerId);
  if (!idData.total) return [];

  const meetingIds: string[] = idData.results.map((m: Meeting) => m.id);

  // --  details -------------------------------------------------
  const meetings = await getMeetingsBatch(meetingIds);
  const assocMap = await getMeetingContactAssociations(meetingIds);
  const uniqueContactIds = Array.from(
    new Set(
      meetingIds.flatMap(
        (id) => assocMap.get(id)?.contacts.map((c) => c.id) ?? []
      )
    )
  );
  const contactMap = await getContacts(uniqueContactIds);

  // --  enrich + return ----------------------------------------
  const enriched = meetings.map((m) => ({
    ...m,
    associations: assocMap.get(m.id)!,
    contactsData: assocMap
      .get(m.id)!
      .contacts.map((c) => contactMap.get(c.id))
      .filter(Boolean),
  }));

  return enriched as MeetingWithContacts[];
}

// ---------------------------------------------------------------------------
// Utility: same wrapper you already expose
// ---------------------------------------------------------------------------
export async function getAllOwnersMeetings() {
  const ownerId = await getHubspotOwnerIdSession();
  //const ownerId = "79900767";
  return searchOwnerMeetings(ownerId);
}
