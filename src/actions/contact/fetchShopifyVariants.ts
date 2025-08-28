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

    // ✅ FIXED: Build SKU → variant map for safe lookup
    const skuToVariantMap = new Map<string, ShopifyVariant>();
    variantsData.data.forEach((variant) => {
      skuToVariantMap.set(variant.sku, variant);
    });

    // ✅ FIXED: Row-based mapping that maintains order and validates all SKUs
    const lineItems: ShopifyVariantLineItem[] = items.map((item, index) => {
      const variant = skuToVariantMap.get(item.sku);

      if (!variant?.variantId) {
        throw new Error(
          `❌ SKU "${item.sku}" (index ${index}) could not resolve to a valid Shopify variant. ` +
            `This will cause quantity misalignment. Please verify the SKU exists in Shopify.`
        );
      }

      const lineItem: ShopifyVariantLineItem = {
        variant_id: variant.variantId,
        quantity: item.quantity,
      };

      // Add discount if it exists and is greater than 0
      if (item.unitDiscount && item.unitDiscount > 0) {
        lineItem.applied_discount = {
          value: item.unitDiscount,
          value_type: "percentage",
          description: `${item.unitDiscount}% off`,
          title: "Discount",
        };
      }

      return lineItem;
    });

    return lineItems;
  } catch (error) {
    throw new Error(
      "Failed to fetch variants: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
