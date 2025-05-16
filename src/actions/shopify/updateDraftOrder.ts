"use server";

const accessToken = process.env.SHOPIFY_X_ACCESS_TOKEN;

export async function updateDraftOrder(draftOrderId: string, lineItems: any[]) {
  const URL = `https://mbtek.myshopify.com/admin/api/2024-01/draft_orders/${draftOrderId}.json`;

  const body = {
    draft_order: {
      line_items: lineItems,
    },
  };

  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": `${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${JSON.stringify(data)}`);
    }

    return {
      status: response.status,
      message: "Draft Order Updated",
      data: data,
    };
  } catch (error) {
    console.error("Shopify API Error:", error);
    return {
      status: 500,
      error: "Failed to update draft order",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
