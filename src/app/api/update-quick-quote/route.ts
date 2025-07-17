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
import { getDealLineItems } from "@/actions/deals/getDealLineItems";
import { generateQuoteProperties } from "@/lib/generateQuoteProperties";
import { sleep } from "@/lib/utils";
import { buildSimpleQuote } from "@/actions/quote/buildSimpleQuote";
import { getHubspotOwnerId } from "@/actions/getOwnerId";
import { deleteQuote } from "@/actions/quote/deleteQuote";
import { getOwnerExtraData } from "@/actions/getOwnerExtraData";
import { createDownpayCart } from "@/actions/contact/createDownpayCart";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    dealId,
    contactId,
    quoteId,
    quoteLink,
    draftOrderId,
    quoteLineItems,
    newMainProduct,
    products,
    splitPayment,
    purchaseOptionId,
    contactData,
    shipmentCost,
    dealOwnerId,
  } = body;

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function sendProgress(eventName: string, payload: any) {
        const data = JSON.stringify(payload);
        const chunk = `event: ${eventName}\ndata: ${data}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }

      try {
        const totalProducts = products.reduce(
          (sum: number, product: { price: number; quantity: number }) =>
            sum + product.price * product.quantity,
          0
        );
        const totalAmount = totalProducts + (Number(shipmentCost) || 0);

        if (splitPayment === "Yes") {
          sendProgress("progress", {
            step: "Split payment quote detected...",
            percentage: 5,
          });
          const newLineItems = await getDealLineItems(dealId, true);
          sendProgress("progress", {
            step: "Preparing line items...",
            percentage: 25,
          });
          /*  if (newMainProduct) {
            sendProgress("progress", {
              step: "Processing main product information...",
              percentage: 30,
            });
            await generateQuoteProperties(newMainProduct, products, contactId);
          } */
          sendProgress("progress", {
            step: "Creating new Downpay Cart checkout...",
            percentage: 35,
          });

          console.log("New Line items:", newLineItems);

          const shopifyItems = newLineItems.map((product) => ({
            sku: product.properties.hs_sku,
            quantity: parseInt(product.properties.quantity),
            unitDiscount: parseFloat(
              product.properties.hs_discount_percentage || "0"
            ),
          }));

          const variantLineItems = await fetchShopifyVariants(shopifyItems);

          const cartLines = variantLineItems.map((item) => ({
            quantity: item.quantity,
            merchandiseId: `gid://shopify/ProductVariant/${item.variant_id}`,
            sellingPlanId: `gid://shopify/SellingPlan/${purchaseOptionId}`,
          }));

          const cartResult = await createDownpayCart(cartLines, contactData);

          sendProgress("progress", {
            step: "Patching new deal properties...",
            percentage: 45,
          });
          await patchDealProperties(dealId, {
            shopify_draft_order_url: cartResult.checkoutUrl,
            shopify_draft_order_id: "",
            amount: totalAmount,
            shipping_cost: Number(shipmentCost),
          });

          sendProgress("progress", {
            step: "Identifying Owner...",
            percentage: 55,
          });
          sendProgress("progress", {
            step: "Deleting Old quote...",
            percentage: 65,
          });
          const deleteOldQuote = await deleteQuote(quoteId);

          sleep(1000);
          const ownerData = await getHubspotOwnerId(dealOwnerId);
          const { phone, jobtitle } = await getOwnerExtraData(ownerData.email);

          sendProgress("progress", {
            step: "Building Quote...",
            percentage: 75,
          });

          const quoteBuilded = await buildSimpleQuote(
            contactId,
            contactData.firstname,
            contactData.lastname,
            dealId,
            ownerData.email,
            ownerData.firstName,
            ownerData.lastName,
            phone,
            jobtitle,
            cartResult.checkoutUrl,
            false,
            newLineItems
          );

          sleep(3000);

          sendProgress("progress", {
            step: "New quote builded...",
            percentage: 100,
          });

          sendProgress("complete", {
            success: true,
            redirect1: quoteBuilded.data,
            redirect2: `/contacts/${contactId}`,
            contactId: contactId,
          });
          return;
        } else {
          // Step 1
          sendProgress("progress", {
            step: "Setting quote on draft...",
            percentage: 5,
          });
          const setDraft = await setQuote(quoteId, "DRAFT");

          // Step 2
          sendProgress("progress", {
            step: "Deleting old products in deal...",
            percentage: 25,
          });

          const newLineItems = await getDealLineItems(dealId, true);

          const updateQuote = await updateQuoteLineItems(
            quoteId,
            [],
            newLineItems
          );

          // Step 3
          sendProgress("progress", {
            step: "Checking main product...",
            percentage: 35,
          });

          /*  if (newMainProduct) {
            sendProgress("progress", {
              step: "Processing main product information...",
              percentage: 40,
            });
            await generateQuoteProperties(newMainProduct, products, contactId);
          } */

          // Step 4
          sendProgress("progress", {
            step: "Updating deal total amount...",
            percentage: 50,
          });

          await patchDealProperties(dealId, {
            amount: totalAmount,
            shipping_cost: Number(shipmentCost),
          });

          // Step 5
          sendProgress("progress", {
            step: "Fetching Shopify variants...",
            percentage: 75,
          });

          const shopifyItems = newLineItems;

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

          // Step 6
          sendProgress("progress", {
            step: "Updating Shopify Draft Order...",
            percentage: 85,
          });

          const variantLineItems = await fetchShopifyVariants(shopifyProducts);

          const updateResult = await updateDraftOrder(
            draftOrderId,
            variantLineItems
          );

          // Step 7
          sendProgress("progress", {
            step: "Approving quote...",
            percentage: 95,
          });

          const setApproved = await setQuote(quoteId, "APPROVED");

          sendProgress("progress", {
            step: "Quote updated",
            quoteUrl: quoteLink,
          });

          revalidatePath(`/contacts/${contactId}`);
          revalidatePath(`/contacts/${contactId}/properties`);
          revalidatePath(`/contacts/${contactId}/deals`);
          revalidatePath(`/contacts/${contactId}/quotes`);
          revalidateTag("quotes");
          revalidateTag("contact-deals");
          sleep(1500);

          sendProgress("complete", {
            success: true,
            redirect1: quoteLink,
            redirect2: `/contacts/${contactId}`,
            contactId: contactId,
          });

          return;
        }
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
