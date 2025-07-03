"use server";

import { Deal, DealWithLineItems, LineItem } from "@/types/dealTypes";

export async function getAllDealsDataWithLineItems(
  contactId: string
): Promise<DealWithLineItems[]> {
  try {
    const dealIds = await getDealsByContactId(contactId);
    if (dealIds.length === 0) {
      console.log("No deals associated with the contact were found.");
      return [];
    }

    const dealDetailsPromises = dealIds.map((dealId) => getDealDetails(dealId));
    const dealsData = await Promise.all(dealDetailsPromises);

    const validDeals = dealsData.filter((deal) => deal !== null);

    const dealsWithLineItemsPromises = validDeals.map(async (deal) => {
      const lineItemIds = await getLineItemsByDealId(deal.id);
      return { ...deal, lineItemIds };
    });

    const dealsWithLineItems = await Promise.all(dealsWithLineItemsPromises);

    const allLineItemsPromises: Promise<(LineItem | null)[]>[] = [];
    dealsWithLineItems.forEach((deal) => {
      const lineItemsPromises = deal.lineItemIds.map((lineItemId) =>
        getLineItemDetails(lineItemId)
      );
      allLineItemsPromises.push(Promise.all(lineItemsPromises));
    });

    const allLineItemsData = await Promise.all(allLineItemsPromises);

    const finalDealsData = dealsWithLineItems.map((deal, index) => {
      const lineItems = allLineItemsData[index].filter(
        (lineItem) => lineItem !== null
      );
      return { ...deal, lineItems };
    });

    return finalDealsData;
  } catch (error) {
    console.error("Error en getAllDealsDataWithLineItems:", error);
    throw new Error(
      "Could not retrieve all the information of the deals and their line items."
    );
  }
}

async function getDealsByContactId(contactId: string): Promise<string[]> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/deal?properties=dealname`;

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
        `Error retrieving deal associations: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((association: { id: string }) => association.id);
  } catch (error) {
    console.error("Error en getDealsByContactId:", error);
    throw new Error("Could not retrieve the deals for the contact.");
  }
}

async function getDealDetails(dealId: string): Promise<Deal | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=dealname,createdate,amount,shipping_cost,dealstage,pipeline,closedate,shopify_draft_order_url,split_payment`;

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
    return data;
  } catch (error) {
    console.error(`Error in getDealDetails for deal ${dealId}:`, error);
    return null;
  }
}

async function getLineItemsByDealId(dealId: string): Promise<string[]> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_item`;

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
  lineItemId: string
): Promise<LineItem | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/line_items/${lineItemId}?properties=quantity,price,name,hs_product_id,hs_images,createdate`;

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
