"use server";

import { Deal } from "@/types/dealTypes";

export async function getDealById(
  dealId: string,
  forceRefresh: boolean = false
): Promise<Deal | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=dealname,createdate,amount,shipping_cost,dealstage,pipeline,closedate,shopify_draft_order_url,shopify_draft_order_id,year_of_construction,insulation_type,specific_needs,other_specific_need,installation_responsible,number_of_zones,zones_configuration,billing_zip,billing_first_name,billing_last_name,billing_email,billing_phone,billing_address,billing_city,billing_state,billing_country,shipping_first_name,shipping_last_name,shipping_email,shipping_phone,shipping_address,shipping_city,shipping_province,shipping_country,shipping_zip_code,delivery_type,dropoff_condition,complete_system_documentation,last_step&associations=contacts`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      ...(forceRefresh
        ? { cache: "no-store" }
        : { next: { tags: [`contact-deals`], revalidate: 300 } }),
    });

    if (!response.ok) {
      throw new Error(
        `Error retrieving deal details for deal ${dealId}: ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error in getDealDetails for deal ${dealId}:`, error);
    return null;
  }
}
