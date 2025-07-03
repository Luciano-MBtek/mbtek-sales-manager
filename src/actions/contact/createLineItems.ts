"use server";

import { Product } from "@/types";
import { revalidateTag } from "next/cache";

export async function createLineItems(dealId: string, products: Product[]) {
  const mapped = products.map((product) => ({
    properties: {
      hs_product_id: product.id.toString(),
      quantity: Number(product.quantity),
      price: Number(product.price),
      hs_discount_percentage: Number(product.unitDiscount),
    },
    associations: [
      {
        to: {
          id: dealId,
        },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 20,
          },
        ],
      },
    ],
  }));

  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    const body = JSON.stringify({ inputs: mapped });

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/line_item/batch/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body,
      }
    );

    if (!response.ok) {
      throw new Error(
        `HubSpot API error: ${response.status} - ${response.statusText}`
      );
    }

    revalidateTag("contact-deals");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating line items:", error);

    throw new Error(
      `Failed to create line items: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
