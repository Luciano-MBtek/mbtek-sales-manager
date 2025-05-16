"use server";

interface ShopifyVariantLineItem {
  variant_id: string;
  quantity: number;
  applied_discount?: {
    value: number;
    value_type: "percentage";
    description: string;
    title: string;
  };
}

const BASE_URL = process.env.MBTEK_API;
const VARIANTS_URL = `${BASE_URL}/mbtek/shopify/variants`;

export type ShopifyItem = {
  sku: string;
  quantity: number;
  unitDiscount: number;
};

interface ShopifyVariant {
  sku: string;
  variantId: string;
}

interface ShopifyVariantResponse {
  status: number;
  data: ShopifyVariant[];
}

export async function fetchShopifyVariants(
  items: ShopifyItem[]
): Promise<ShopifyVariantLineItem[]> {
  try {
    const variantsPayload = { items };

    const response = await fetch(VARIANTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variantsPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch variants: ${response.statusText}`);
    }

    const variantsData: ShopifyVariantResponse = await response.json();

    // Map the variants to the format needed for line items
    const lineItems: ShopifyVariantLineItem[] = variantsData.data.map(
      (variant, index) => {
        const item: ShopifyVariantLineItem = {
          variant_id: variant.variantId,
          quantity: items[index].quantity,
        };

        // Add discount if it exists and is greater than 0
        if (items[index].unitDiscount && items[index].unitDiscount > 0) {
          item.applied_discount = {
            value: items[index].unitDiscount,
            value_type: "percentage",
            description: `${items[index].unitDiscount}% off`,
            title: "Discount",
          };
        }

        return item;
      }
    );

    return lineItems;
  } catch (error) {
    console.error("Error fetching Shopify variants:", error);
    throw new Error(
      "Failed to fetch variants: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
