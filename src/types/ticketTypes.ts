export type TicketProperties = {
  hubspot_owner_id?: string;
  subject?: string;
  content?: string;
  hs_ticket_priority?: string;
  createdate?: string;
  hs_pipeline?: string;
  hs_pipeline_stage?: string;
  source_type?: string;
  hs_ticket_category?: string;
  [key: string]: any;
};

export type Ticket = {
  id: string;
  properties?: TicketProperties;
  [key: string]: any;
};

export type OwnerData = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any;
};
