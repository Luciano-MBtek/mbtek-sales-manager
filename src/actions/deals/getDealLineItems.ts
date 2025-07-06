"use server";

import { LineItem } from "@/types/dealTypes";

export async function getDealLineItems(
  dealId: string,
  forceRefresh: boolean = false
): Promise<LineItem[]> {
  try {
    const lineItemIds = await getLineItemsByDealId(dealId, forceRefresh);
    if (lineItemIds.length === 0) {
      return [];
    }

    const lineItemsPromises = lineItemIds.map((id) =>
      getLineItemDetails(id, forceRefresh)
    );
    const lineItemsData = await Promise.all(lineItemsPromises);

    return lineItemsData.filter((item): item is LineItem => item !== null);
  } catch (error) {
    console.error(`Error in getDealLineItems for deal ${dealId}:`, error);
    throw new Error("Could not retrieve the line items for the deal.");
  }
}

async function getLineItemsByDealId(
  dealId: string,
  forceRefresh: boolean
): Promise<string[]> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_item`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      ...(forceRefresh
        ? { cache: "no-store" }
        : { next: { tags: ["contact-deals"], revalidate: 300 } }),
    });

    if (!response.ok) {
      throw new Error(
        `Error retrieving line item associations for deal ${dealId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((association: { id: string }) => association.id);
  } catch (error) {
    console.error(
      `Error in getLineItemsByDealId for the deal ${dealId}:`,
      error
    );
    return [];
  }
}

async function getLineItemDetails(
  lineItemId: string,
  forceRefresh: boolean
): Promise<LineItem | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/line_items/${lineItemId}?properties=quantity,price,name,hs_product_id,hs_images,createdate,hs_discount_percentage,hs_sku`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      ...(forceRefresh
        ? { cache: "no-store" }
        : { next: { tags: ["contact-deals"], revalidate: 300 } }),
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching line item details for ${lineItemId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Error in getLineItemDetails for the line item ${lineItemId}:`,
      error
    );
    return null;
  }
}
