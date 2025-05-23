"use server";

type UpcomingMeeting = {
  id: string;
  title: string | null;
  start: string;
  end: string | null;
  link: string | null;
};

type ContactMeetingsResult = {
  meetingIds: string[];
  upcoming: UpcomingMeeting | null;
};

type MeetingsByContact = Record<number, ContactMeetingsResult>;

const MEETING_PROPS = [
  "hs_meeting_title",
  "hs_meeting_start_time",
  "hs_meeting_end_time",
  "hs_meeting_external_url",
] as const;

/**
 * Retrieves all meetings associated with the specified contacts
 * and determines the next upcoming meeting (if any) for each contact.
 */
export async function getContactMeetings(
  contactIds: number | number[]
): Promise<MeetingsByContact> {
  const apiKey = process.env.HUBSPOT_API_KEY!;
  const ids = Array.isArray(contactIds) ? contactIds : [contactIds];

  const assocResults = await Promise.all(
    ids.map(async (cid) => {
      const url =
        `https://api.hubapi.com/crm/v3/objects/contacts/` +
        `${cid}/associations/meetings`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { tags: [`meeting-association-${cid}`], revalidate: 300 },
      });

      if (!res.ok) {
        console.error(`❌ Assoc error (${cid}):`, res.statusText);
        return { cid, meetingIds: [] as string[] };
      }

      const data: { results: { id: string }[] } = await res.json();
      return { cid, meetingIds: data.results.map((r) => r.id) };
    })
  );

  const allMeetingIds = [...new Set(assocResults.flatMap((r) => r.meetingIds))];
  const detailById = new Map<string, UpcomingMeeting>();

  if (allMeetingIds.length) {
    const batchRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/meetings/batch/read",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: MEETING_PROPS,
          inputs: allMeetingIds.map((id) => ({ id })),
        }),
      }
    );

    if (!batchRes.ok) {
      throw new Error(
        `HubSpot batch meeting read failed: ${batchRes.statusText}`
      );
    }

    const batchData: {
      results: {
        id: string;
        properties: Record<(typeof MEETING_PROPS)[number], string | null>;
      }[];
    } = await batchRes.json();

    batchData.results.forEach((m) =>
      detailById.set(m.id, {
        id: m.id,
        title: m.properties.hs_meeting_title,
        start: m.properties.hs_meeting_start_time!,
        end: m.properties.hs_meeting_end_time,
        link: m.properties.hs_meeting_external_url,
      })
    );
  }

  const now = Date.now();

  return assocResults.reduce<MeetingsByContact>((acc, { cid, meetingIds }) => {
    const futureSorted = meetingIds
      .map((mid) => detailById.get(mid))
      .filter((m): m is UpcomingMeeting => !!m && Date.parse(m.start) > now)
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    acc[cid] = {
      meetingIds,
      upcoming: futureSorted[0] ?? null,
    };

    return acc;
  }, {});
}
