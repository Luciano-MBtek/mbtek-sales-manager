import { leadStatusValues } from "@/types";

export type EngagementStatus = (typeof leadStatusValues)[number];

export interface ContactData {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    [key: string]: string;
  };
}

export interface Associations {
  contacts: { id: string; type: string }[];
  companies: { id: string; type: string }[];
  deals: { id: string; type: string }[];
  [key: string]: { id: string; type: string }[];
}

export interface Engagement {
  id: string;
  properties: {
    hs_object_id: string;
    hubspot_owner_id: string;
    hs_createdate: string;
    hs_timestamp: string;
    hs_call_duration: string | null;
    hs_call_title: string | null;
    hs_body_preview: string | null;
    hs_engagement_source: string | null;
    hs_engagement_type: string;
    [key: string]: string | null;
  };
  associations: Associations;
  contactsData?: ContactData[];
}

export const getEngagementSource = (engagement: Engagement) => {
  const { properties } = engagement;
  const type = properties.hs_engagement_type as EngagementStatus;

  if (type === "NOTE" && properties.hs_object_source_detail_1 === "Tidio") {
    return "SMS";
  }

  switch (type) {
    case "EMAIL":
    case "INCOMING_EMAIL":
    case "FORWARDED_EMAIL":
      return "Email";
    case "CALL":
      return "Call";
    case "NOTE":
      return "Note";
    case "TASK":
      return "Task";
    case "MEETING":
      return "Meeting";
    case "SMS":
      return "SMS";
    case "WHATS_APP":
      return "WhatsApp";
    case "LINKEDIN_MESSAGE":
      return "LinkedIn";
    case "POSTAL_MAIL":
      return "Mail";
    case "CONVERSATION_SESSION":
      return "Conversation";
    case "PUBLISHING_TASK":
      return "Publishing";
    case "CUSTOM_CHANNEL_CONVERSATION":
      return "Custom Channel";
    default:
      return type || "Unknown";
  }
};

export const getEngagementStatus = (
  engagement: Engagement
): EngagementStatus => {
  const contact = engagement.contactsData?.[0];
  const contactStatus = contact?.properties.hs_lead_status;

  if (contactStatus && leadStatusValues.includes(contactStatus as any)) {
    return contactStatus as EngagementStatus;
  }
  return "Unqualified";
};

export const getStatusBadgeVariant = (status: EngagementStatus) => {
  switch (status) {
    case "NEW":
      return "success";
    case "IN_PROGRESS":
      return "progress";
    case "OPEN_DISCOVERY":
      return "warning";
    case "OPEN_DEAL":
      return "secondary";
    case "Disqualified":
      return "outline";
    case "Unable to Contact":
    case "Not sales related":
      return "destructive";
    default:
      return "default";
  }
};

export const truncateMessage = (message: string, maxLength = 60) => {
  if (!message) return "No message available";
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + "...";
};

export const getContactName = (engagement: Engagement) => {
  const contact = engagement.contactsData?.[0];
  if (!contact) return "Unknown Contact";

  const firstName = contact.properties.firstname || "";
  const lastName = contact.properties.lastname || "";
  return `${firstName} ${lastName}`.trim() || "Unknown Contact";
};

export const getContactEmail = (engagement: Engagement) => {
  const contact = engagement.contactsData?.[0];
  return contact?.properties.email || "";
};

export const getContactInitials = (engagement: Engagement) => {
  const contact = engagement.contactsData?.[0];
  if (!contact) return "?";

  const firstName = contact.properties.firstname || "";
  const lastName = contact.properties.lastname || "";
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
};

export const formatCallDuration = (duration: string | null) => {
  if (!duration) return "0:00";
  const seconds = Number.parseInt(duration) / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const getMessagePreview = (engagement: Engagement) => {
  const { properties } = engagement;

  if (properties.hs_engagement_type === "CALL") {
    const duration = properties.hs_call_duration
      ? ` (${formatCallDuration(properties.hs_call_duration)})`
      : "";
    return `${properties.hs_call_title || "Phone call"}${duration}`;
  }

  return properties.hs_body_preview || "No preview available";
};
