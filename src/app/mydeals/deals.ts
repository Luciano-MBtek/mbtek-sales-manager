export interface Contact {
  id: string;
  firstname?: string;
  lastname?: string;
}

export interface Deal {
  id: string;
  properties: {
    amount: string;
    createdate: string;
    dealname: string;
    dealstage: string;
    hs_lastmodifieddate: string;
    pipeline: string;
    closedate: string;
  };
  contacts: Contact[];
}
