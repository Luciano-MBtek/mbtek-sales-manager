"use server";

import { Product } from "@/types";
import { getDealLineItems } from "./getDealLineItems";
import { deleteLineItems } from "./deleteLineItems";
import { createLineItems } from "@/actions/contact/createLineItems";
import { revalidateTag } from "next/cache";

export async function manageLineItems(dealId: string, newProducts: Product[]) {
  try {
    // Step 1: Get existing line items for the deal
    const existingLineItems = await getDealLineItems(dealId, true);

    // Step 2: Categorize products for different operations
    const itemsToDelete: string[] = [];
    const itemsToCreate: Product[] = [];

    // Identify items to delete (existing items not in new products)
    for (const existingItem of existingLineItems) {
      const matchingNewProduct = newProducts.find(
        (p) => p.id.toString() === existingItem.properties.hs_product_id
      );

      if (!matchingNewProduct) {
        // Product was removed, mark for deletion
        itemsToDelete.push(existingItem.id);
      }
    }

    // Identify items to create (new products not in existing items)
    // and also items with changed quantities or discounts
    for (const newProduct of newProducts) {
      const existingItem = existingLineItems.find(
        (item) => item.properties.hs_product_id === newProduct.id.toString()
      );

      const needsUpdate =
        !existingItem ||
        Number(existingItem.properties.quantity) !==
          Number(newProduct.quantity) ||
        Number(existingItem.properties.hs_discount_percentage) !==
          Number(newProduct.unitDiscount);

      if (needsUpdate) {
        // If existing item with different properties, mark old one for deletion
        if (existingItem && !itemsToDelete.includes(existingItem.id)) {
          itemsToDelete.push(existingItem.id);
        }

        // Add to creation list
        itemsToCreate.push(newProduct);
      }
    }

    // Step 3: Perform operations
    let results = { deleted: 0, created: 0 };

    // Delete items that are no longer needed
    if (itemsToDelete.length > 0) {
      const deleteResult = await deleteLineItems(itemsToDelete);
      results.deleted = deleteResult.deleted;
    }

    // Create new items
    if (itemsToCreate.length > 0) {
      const createResult = await createLineItems(dealId, itemsToCreate);
      results.created = createResult.results.length;
    }
    revalidateTag("contact-deals");

    return {
      success: true,
      ...results,
    };
  } catch (error) {
    console.error("Error managing line items:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
