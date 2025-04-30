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
}

export interface Deal {
  id: string;
  properties: DealProperties;
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
