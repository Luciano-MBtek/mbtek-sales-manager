export type TaskProperties = {
  // Task information
  hs_task_subject: string;
  hs_task_status: string;
  hs_task_priority: string;
  hs_task_body: string;
  hs_task_type: string;
  hs_body_preview?: string;
  hs_body_preview_html?: string;
  hs_body_preview_is_truncated?: boolean;

  // Dates and timestamps
  hs_createdate: string;
  hs_timestamp: string;
  hs_lastmodifieddate: string;

  // Ownership and assignments
  hubspot_owner_id: string;
  hubspot_owner_assigneddate?: string;
  hubspot_team_id?: string;
  hs_created_by?: string;
  hs_created_by_user_id?: string;
  hs_modified_by?: string;
  hs_updated_by_user_id?: string;
  hs_all_owner_ids?: string;
  hs_all_team_ids?: string;
  hs_all_accessible_team_ids?: string;
  hs_all_assigned_business_unit_ids?: string;
  hs_at_mentioned_owner_ids?: string;

  // Task status and completion
  hs_task_is_completed?: boolean;
  hs_task_is_completed_call?: boolean;
  hs_task_is_completed_email?: boolean;
  hs_task_is_completed_linked_in?: boolean;
  hs_task_is_completed_sequence?: boolean;
  hs_task_is_overdue?: boolean;
  hs_task_is_past_due_date?: boolean;
  hs_task_completion_count?: number;
  hs_task_completion_date?: string;
  hs_task_missed_due_date?: boolean;
  hs_task_missed_due_date_count?: number;

  // Task details
  hs_task_for_object_type?: string;
  hs_task_family?: string;
  hs_task_is_all_day?: boolean;
  hs_task_contact_timezone?: string;
  hs_task_probability_to_complete?: number;
  hs_task_relative_reminders?: string;
  hs_task_reminders?: string;
  hs_task_repeat_interval?: string;
  hs_repeat_status?: string;
  hs_task_send_default_reminder?: boolean;
  hs_follow_up_action?: string;

  // Associations
  hs_associated_company_labels?: string;
  hs_associated_contact_labels?: string;

  // Attachments and content
  hs_attachment_ids?: string;
  hs_calendar_event_id?: string;

  // Marketing and campaign related
  hs_marketing_task_category?: string;
  hs_marketing_task_category_id?: string;
  hs_task_campaign_guid?: string;
  hs_task_template_id?: string;

  // Sequence related
  hs_task_sequence_enrollment_active?: boolean;
  hs_task_sequence_step_enrollment_contact_id?: string;
  hs_task_sequence_step_enrollment_id?: string;
  hs_task_sequence_step_order?: string;

  // Activity tracking
  hs_engagement_source?: string;
  hs_engagement_source_id?: string;
  hs_engagements_last_contacted?: string;
  hs_task_last_contact_outreach?: string;
  hs_task_last_sales_activity_timestamp?: string;

  // System properties
  hs_object_id?: string;
  hs_unique_id?: string;
  hs_unique_creation_key?: string;
  hs_read_only?: boolean;
  hs_was_imported?: boolean;
  hs_gdpr_deleted?: boolean;
  hs_merged_object_ids?: string;
  hs_object_source?: string;
  hs_object_source_id?: string;
  hs_object_source_label?: string;
  hs_object_source_user_id?: string;
  hs_object_source_detail_1?: string;
  hs_object_source_detail_2?: string;
  hs_object_source_detail_3?: string;

  // Teams and permissions
  hs_shared_team_ids?: string;
  hs_shared_user_ids?: string;
  hs_owning_teams?: string;
  hs_queue_membership_ids?: string;
  hs_user_ids_of_all_notification_followers?: string;
  hs_user_ids_of_all_notification_unfollowers?: string;
  hs_user_ids_of_all_owners?: string;

  // Pipeline related
  hs_pipeline?: string;
  hs_pipeline_stage?: string;

  // Other properties
  hs_product_name?: string;
  hs_scheduled_tasks?: string;
  hs_obj_coords?: string;
  hs_msteams_message_id?: string;
  hs_task_ms_teams_payload?: string;

  // Date tracking fields
  hs_date_entered_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096?: string;
  hs_date_entered_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342?: string;
  hs_date_entered_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531?: string;
  hs_date_entered_dd5826e4_c976_4654_a527_b59ada542e52_2144133616?: string;
  hs_date_entered_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675?: string;
  hs_date_exited_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096?: string;
  hs_date_exited_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342?: string;
  hs_date_exited_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531?: string;
  hs_date_exited_dd5826e4_c976_4654_a527_b59ada542e52_2144133616?: string;
  hs_date_exited_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675?: string;
  hs_time_in_60b5c368_04c4_4d32_9b4a_457e159f49b7_13292096?: string;
  hs_time_in_61bafb31_e7fa_46ed_aaa9_1322438d6e67_1866552342?: string;
  hs_time_in_af0e6a5c_2ea3_4c72_b69f_7c6cb3fdb591_1652950531?: string;
  hs_time_in_dd5826e4_c976_4654_a527_b59ada542e52_2144133616?: string;
  hs_time_in_fc8148fb_3a2d_4b59_834e_69b7859347cb_1813133675?: string;

  // Allow for additional properties
};

export interface Task {
  id: string;
  properties: TaskProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  contactsData?: ContactData[];
  associations?: Associations;
}

export interface ContactData {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    hs_lead_status: string;
  };
}

export interface Associations {
  contacts: Association[];
  companies: Association[];
  deals: Association[];
}

export interface Association {
  id: string;
  type: string;
}
