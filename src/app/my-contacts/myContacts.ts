export interface OwnedContacts {
  id: string;
  properties: {
    createdate: string;
    email: string;
    firstname: string;
    lastname: string;
    lastmodifieddate: string;
    phone: string;
    company: string | null;
    lead_type: string;
    total_revenue: string;
  };
}
