"use server";

import { Deal } from "@/types/dealTypes";

export async function getDealById(dealId: string): Promise<Deal | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=dealname,createdate,amount,shipping_cost,dealstage,pipeline,closedate,shopify_draft_order_url,shopify_draft_order_id`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { tags: [`contact-deals`], revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Error retrieving deal details for deal ${dealId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Deal data loaded:", data);
    return data;
  } catch (error) {
    console.error(`Error in getDealDetails for deal ${dealId}:`, error);
    return null; // Retornar null para manejar errores individualmente
  }
}
