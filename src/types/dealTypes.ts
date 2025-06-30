export interface DealProperties {
  dealname: string;
  shipping_cost: number;
  amount: number;
  createdate: string;
  dealstage: string;
  hs_lastmodifieddate: string;
  hs_object_id: string;
  closedate: string;
  pipeline?: string | null;
  shopify_draft_order_url: string;
  shopify_draft_order_id: string;
  year_of_construction: number;
  insulation_type: string;
  specific_needs: string;
  other_specific_need?: string;
  installation_responsible: string;
  complete_system_documentation: string;
  last_step?: string;
  number_of_zones?: string;
  zones_configuration?: string;
  billing_zip?: string;
  billing_first_name?: string;
  billing_last_name?: string;
  billing_email?: string;
  billing_phone?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_country?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_email?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_country?: string;
  shipping_province?: string;
  shipping_zip_code?: string;
  delivery_type?: string;
  dropoff_condition?: string;
}

export interface Deal {
  id: string;
  properties: DealProperties;
  associations: {
    contacts: {
      results: {
        id: string;
        type: string;
      }[];
    };
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface LineItemProperties {
  quantity: string;
  price: string;
  name: string;
  hs_product_id: string;
  hs_images?: string | undefined;
  createdate: string;
  hs_discount_percentage: string;
  hs_sku: string;
}

export interface LineItem {
  id: string;
  properties: LineItemProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  associations?: {
    deals: {
      results: DealAssociation[];
    };
  };
}

export interface DealWithLineItems extends Deal {
  lineItemIds: string[];
  lineItems: LineItem[];
}

export interface DealAssociation {
  id: string;
  type: string;
}
