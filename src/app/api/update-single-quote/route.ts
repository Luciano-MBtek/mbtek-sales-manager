import { NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";
import setQuote from "@/actions/quote/setQuote";
import { deleteLineItems } from "@/actions/deals/deleteLineItems";
import { createLineItems } from "@/actions/contact/createLineItems";
import { updateQuoteLineItems } from "@/actions/quote/updateQuoteLineItems";
import { LineItemFormValues } from "@/app/contacts/[id]/quotes/[quoteId]/QuoteUpdateForm";
import {
  fetchShopifyVariants,
  ShopifyItem,
} from "@/actions/contact/fetchShopifyVariants";
import { updateDraftOrder } from "@/actions/shopify/updateDraftOrder";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    lineItems,
    oldLineItemIds,
    dealId,
    contactId,
    quoteId,
    newProducts,
    quoteLink,
    draftOrderId,
  } = body;

  console.log("lineItems:", lineItems);
  console.log("oldLineItemIds:", oldLineItemIds);
  console.log("dealId:", dealId);
  console.log("contactId:", contactId);
  console.log("quoteId:", quoteId);
  console.log("newProducts:", newProducts);
  console.log("Draft Order Id:", draftOrderId);

  const formattedLineItems = lineItems.map((item: LineItemFormValues) => ({
    id: item.hs_product_id, // Usar hs_product_id como id principal
    quantity: item.quantity,
    price: item.price,
    unitDiscount: item.unitDiscount,
    name: item.name,
    sku: item.sku,
    image: item.image,
    // No incluimos el id original del line item
  }));

  // Formatear los nuevos productos si existen
  const formattedNewProducts = newProducts
    ? newProducts.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        unitDiscount: item.unitDiscount || 0,
        name: item.name,
        sku: item.sku || "",
        image: item.image || "",
      }))
    : [];

  // Combinar los productos existentes con los nuevos
  const allProducts = [...formattedLineItems, ...formattedNewProducts];

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function sendProgress(eventName: string, payload: any) {
        const data = JSON.stringify(payload);
        const chunk = `event: ${eventName}\ndata: ${data}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }

      // Helper function to add delay
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      try {
        // Step 1
        sendProgress("progress", {
          step: "Setting quote on draft...",
          percentage: 5,
        });
        // set quote to 'draft'
        const setDraft = await setQuote(quoteId, "DRAFT");
        console.log("Quote set to DRAFT:", setDraft);

        // Step 2
        sendProgress("progress", {
          step: "deleting old products in deal...",
          percentage: 15,
        });

        // Usar oldLineItemIds para eliminar los line items antiguos
        const deleteResult = await deleteLineItems(oldLineItemIds || []);
        console.log("Deleted old line items:", deleteResult);

        // Step 3
        sendProgress("progress", {
          step: "creating new products...",
          percentage: 35,
        });

        // Crear todos los line items (existentes y nuevos)
        const newLineItems = await createLineItems(dealId, allProducts);
        console.log("Created line items:", newLineItems);

        // Step 4
        sendProgress("progress", {
          step: "update new products on quote...",
          percentage: 65,
        });

        const updateQuote = await updateQuoteLineItems(
          quoteId,
          oldLineItemIds || [],
          newLineItems.results
        );
        console.log("Updated quote line items:", updateQuote);

        // Step 5
        sendProgress("progress", {
          step: "fetching Shopify variants...",
          percentage: 75,
        });

        const shopifyItems = newLineItems.results;

        const shopifyProducts: ShopifyItem[] = shopifyItems.map(
          (item: {
            properties: {
              hs_sku: any;
              quantity: string;
              hs_discount_percentage: any;
            };
          }) => ({
            sku: item.properties.hs_sku,
            quantity: parseInt(item.properties.quantity),
            unitDiscount: parseFloat(
              item.properties.hs_discount_percentage || "0"
            ),
          })
        );

        sendProgress("progress", {
          step: "Updating Shopify Draft Order...",
          percentage: 85,
        });

        const variantLineItems = await fetchShopifyVariants(shopifyProducts);

        const updateResult = await updateDraftOrder(
          draftOrderId,
          variantLineItems
        );

        console.log("Update Draft Order:", updateResult);

        // Step 6
        sendProgress("progress", {
          step: "approving quote...",
          percentage: 95,
        });

        const setApproved = await setQuote(quoteId, "APPROVED");
        console.log("Quote set to APPROVAL:", setApproved);

        sendProgress("progress", {
          step: "Quote updated",
          quoteUrl: quoteLink,
        });

        console.log("Revalidating paths for contactId:", contactId);
        revalidatePath(`/contacts/${contactId}`);
        revalidatePath(`/contacts/${contactId}/properties`);
        revalidatePath(`/contacts/${contactId}/deals`);
        revalidatePath(`/contacts/${contactId}/quotes`);
        revalidateTag("quotes");
        revalidateTag("contact-deals");

        sendProgress("complete", {
          success: true,
          redirect1: quoteLink,
          redirect2: `/contacts/${contactId}`,
          contactId: contactId,
        });
      } catch (error) {
        console.error("Error updating quote:", error);
        sendProgress("error", {
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
