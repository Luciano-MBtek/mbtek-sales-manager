export type Meeting = {
  id: string;
  properties: {
    hs_createdate: string;
    hs_lastmodifieddate: string;
    hs_object_id: string;
    hs_attendee_owner_ids?: string[];
    hs_booking_instance_id?: number;
    hs_contact_first_outreach_date?: string;
    hs_created_by_scheduling_page?: string;
    hs_external_calendar_id?: string;
    hs_guest_emails?: string;
    hs_i_cal_uid?: string;
    hs_include_description_in_reminder?: boolean;
    hs_internal_meeting_notes?: string;
    hs_meeting_body?: string;
    hs_meeting_calendar_event_hash?: string;
    hs_meeting_change_id?: string;
    hs_meeting_created_from_link_id?: string;
    hs_meeting_end_time?: string;
    hs_meeting_external_url?: string;
    hs_meeting_location?: string;
    hs_meeting_location_type?: "PHONE" | "ADDRESS" | "CUSTOM" | "VCE";
    hs_meeting_ms_teams_payload?: string;
    hs_meeting_notetaker_id?: string;
    hs_meeting_outcome?:
      | "SCHEDULED"
      | "COMPLETED"
      | "RESCHEDULED"
      | "NO_SHOW"
      | "CANCELED";
    hs_meeting_payments_session_id?: string;
    hs_meeting_pre_meeting_prospect_reminders?: string[];
    hs_meeting_source?:
      | "CRM_UI"
      | "INTEGRATION"
      | "AVAILABILITY_SCHEDULE"
      | "BIDIRECTIONAL_API"
      | "BIDIRECTIONAL_SYNC"
      | "MEETINGS_EMBEDDED"
      | "MEETINGS_PUBLIC";
    hs_meeting_source_id?: string;
    hs_meeting_start_time?: string;
    hs_meeting_title?: string;
    hs_meeting_transcript?: string;
    hs_meeting_web_conference_meeting_id?: string;
    hs_roster_object_coordinates?: string;
    hs_scheduled_tasks?: string;
    hs_time_to_book_meeting_from_first_contact?: number;
    hs_timezone?: string;
    hs_video_conference_url?: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};

type GoogleEventDateTime = {
  dateTime: string;
  timeZone: string;
};

type GoogleEventPerson = {
  email: string;
  self?: boolean;
};

type GoogleConferenceEntryPoint = {
  entryPointType: string;
  uri: string;
  label?: string;
};

type GoogleConferenceSolutionKey = {
  type: string;
};

type GoogleConferenceSolution = {
  key: GoogleConferenceSolutionKey;
  name: string;
  iconUri: string;
};

type GoogleCreateRequestStatus = {
  statusCode: string;
};

type GoogleCreateRequest = {
  requestId: string;
  conferenceSolutionKey: GoogleConferenceSolutionKey;
  status: GoogleCreateRequestStatus;
};

type GoogleConferenceData = {
  createRequest: GoogleCreateRequest;
  entryPoints: GoogleConferenceEntryPoint[];
  conferenceSolution: GoogleConferenceSolution;
  conferenceId: string;
};

export type GoogleEventResponse = {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description?: string;
  location?: string;
  creator: GoogleEventPerson;
  organizer: GoogleEventPerson;
  start: GoogleEventDateTime;
  end: GoogleEventDateTime;
  iCalUID: string;
  sequence: number;
  hangoutLink?: string;
  conferenceData?: GoogleConferenceData;
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
  error?: any;
};

/* Response: {
  kind: 'calendar#event',
  etag: '"3487051588204350"',
  id: '1vqtvne3akgdkv1p1u86951574',
  status: 'confirmed',
  htmlLink: 'https://www.google.com/calendar/event?eid=MXZxdHZuZTNha2dka3YxcDF1ODY5NTE1NzQgaW5mby5sdWNpYW5vLmRlc2lnbkBt',
  created: '2025-04-01T16:43:13.000Z',
  updated: '2025-04-01T16:43:14.102Z',
  summary: 'Testing Meeting Creation',
  description: 'Testing',
  location: 'Google Meet',
  creator: { email: 'info.luciano.design@gmail.com', self: true },
  organizer: { email: 'info.luciano.design@gmail.com', self: true },
  start: {
    dateTime: '2025-04-02T13:00:00-03:00',
    timeZone: 'America/Argentina/Buenos_Aires'
  },
  end: {
    dateTime: '2025-04-02T14:00:00-03:00',
    timeZone: 'America/Argentina/Buenos_Aires'
  },
  iCalUID: '1vqtvne3akgdkv1p1u86951574@google.com',
  sequence: 0,
  hangoutLink: 'https://meet.google.com/dag-crqs-iyr',
  conferenceData: {
    createRequest: {
      requestId: 'meeting-1743525793225',
      conferenceSolutionKey: [Object],
      status: [Object]
    },
    entryPoints: [ [Object] ],
    conferenceSolution: {
      key: [Object],
      name: 'Google Meet',
      iconUri: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png'
    },
    conferenceId: 'dag-crqs-iyr'
  },
  reminders: { useDefault: true },
  eventType: 'default'
} */
