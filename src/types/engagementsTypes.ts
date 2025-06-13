export type Engagement = {
  engagement: {
    id: number;
    type: string;
    timestamp: number;
    bodyPreview: string;
  };
  metadata: {
    from?: { email: string; firstName: string; lastName: string };
    to?: Array<{ email: string; firstName: string; lastName: string }>;
    subject?: string;
    toNumber?: string;
    fromNumber?: string;
    status: string;
    title: string;
    durationMilliseconds?: number;
    body: string;
    html: string;
    text: string;
    priority: string;
    taskType: string;
  };
};

type EngagementsTypes =
  | "CALL"
  | "CONVERSATION_SESSION"
  | "INCOMING_EMAIL"
  | "EMAIL"
  | "FORWARDED_EMAIL"
  | "LINKEDIN_MESSAGE"
  | "MEETING"
  | "NOTE"
  | "POSTAL_MAIL"
  | "PUBLISHING_TASK"
  | "SMS"
  | "TASK"
  | "WHATS_APP"
  | "CUSTOM_CHANNEL_CONVERSATION";

export type EngagementProperties = {
  hs_object_id: string;
  hubspot_owner_id: string;
  hs_createdate: string;
  hs_lastmodifieddate: string;
  hs_timestamp: string;
  hs_call_duration: string | null;
  hs_call_title: string | null;
  hs_body_preview: string | null;
  hs_body_preview_html: string | null;
  hs_communication_body: string | null;
  hs_communication_channel_type: string | null;
  hs_communication_logged_from: string | null;
  hs_engagement_source: string | null;
  hs_engagement_type: EngagementsTypes | null;
  hs_created_by: string | null;
  hs_modified_by: string | null;
  hs_attachment_ids: string | null;
  hs_read_only: string | null;
  hs_user_ids_of_all_owners: string | null;
  hs_all_owner_ids: string | null;
  hs_all_team_ids: string | null;
  hs_all_accessible_team_ids: string | null;
  hs_owning_teams: string | null;
  hs_shared_team_ids: string | null;
  hs_shared_user_ids: string | null;
  hs_user_ids_of_all_notification_followers: string | null;
  hs_user_ids_of_all_notification_unfollowers: string | null;
  hs_at_mentioned_owner_ids: string | null;
  hs_engagements_last_contacted: string | null;
  hs_gdpr_deleted: string | null;
  hs_was_imported: string | null;
  hs_obj_coords: string | null;
  hs_merged_object_ids: string | null;
  hs_unique_creation_key: string | null;
  hs_unique_id: string | null;
  hs_object_source: string | null;
  hs_object_source_id: string | null;
  hs_object_source_label: string | null;
  hs_object_source_user_id: string | null;
  hs_object_source_detail_1: string | null;
  hs_object_source_detail_2: string | null;
  hs_object_source_detail_3: string | null;
  hs_engagement_source_id: string | null;
  hs_communication_conversation_object_id: string | null;
  hs_communication_conversations_thread_id: string | null;
  hs_communication_conversations_channel_ids: string | null;
  hs_communication_conversations_channel_instance_ids: string | null;
  hs_communication_conversations_first_message_at: string | null;
  hs_communication_conversation_associations_synced_at: string | null;
  hubspot_owner_assigneddate: string | null;
  hs_call_body: string | null;
  [key: string]: string | null;
};
