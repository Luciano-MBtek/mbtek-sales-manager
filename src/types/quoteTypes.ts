export interface Quote {
  id: string;
  properties: QuoteProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  associations?: {
    "line items": {
      results: LineItemAssociation[];
    };
  };
}

export interface QuoteProperties {
  hs_object_id: string;
  hs_images: string;
  hs_pdf_download_link: string;
  hs_quote_link: string;
  hs_status: string;
  hs_quote_amount: string;
  hs_title: string;
  hs_expiration_date: string;
  hs_terms: string;
}

export interface LineItemAssociation {
  id: string;
  type: string;
}

export type QuoteAssociated = string[];
