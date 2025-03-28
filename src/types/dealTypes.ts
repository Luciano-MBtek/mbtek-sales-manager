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
  hs_images: string;
  createdate: string;
}

export interface LineItem {
  id: string;
  properties: LineItemProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface DealWithLineItems extends Deal {
  lineItemIds: string[];
  lineItems: LineItem[];
}
