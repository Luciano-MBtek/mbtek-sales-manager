import { NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";
import setQuote from "@/actions/quote/setQuote";
import { createAIDescription } from "@/actions/openAi/createAIresponse";
import { updateQuoteLineItems } from "@/actions/quote/updateQuoteLineItems";
import {
  fetchShopifyVariants,
  ShopifyItem,
} from "@/actions/contact/fetchShopifyVariants";
import { updateDraftOrder } from "@/actions/shopify/updateDraftOrder";
import { getDealLineItems } from "@/actions/deals/getDealLineItems";
import getShopifyMainProduct from "@/actions/contact/getShopifyMainProduct";
import { Product } from "@/types";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { getDate } from "@/lib/utils";

const today = getDate();

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
  } = body;

  console.log("dealId:", dealId);
  console.log("contactId:", contactId);
  console.log("quoteId:", quoteId);
  console.log("quoteLink:", quoteLink);
  console.log("Draft Order Id:", draftOrderId);
  console.log("Line Items in Quote:", quoteLineItems);
  console.log("Current Main Product on Quote:", newMainProduct);

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function sendProgress(eventName: string, payload: any) {
        const data = JSON.stringify(payload);
        const chunk = `event: ${eventName}\ndata: ${data}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }

      try {
        // Step 1
        sendProgress("progress", {
          step: "Setting quote on draft...",
          percentage: 5,
        });
        const setDraft = await setQuote(quoteId, "DRAFT");
        console.log("Quote set to DRAFT:", setDraft);

        // Step 2
        sendProgress("progress", {
          step: "Deleting old products in deal...",
          percentage: 25,
        });

        const newLineItems = await getDealLineItems(dealId, true);
        console.log("New Line Items: ", newLineItems);

        const updateQuote = await updateQuoteLineItems(
          quoteId,
          [],
          newLineItems
        );
        console.log("Updated quote line items:", updateQuote);

        // Step 3
        sendProgress("progress", {
          step: "Checking main product...",
          percentage: 35,
        });

        if (newMainProduct) {
          // Step 3.a
          const mainProduct = products.filter(
            (product: Product) => product.isMain === true
          );
          const singleSchematicFanCoilHeatPump =
            "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Generic-Schematics/Generic%20Schematic-1.svg";

          const singleSchematicBoiler =
            "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Generic-Schematics/Boiler%20-%20Radiant%20Heat.svg";

          const productSchematic = /heat pump|fan coil/i.test(
            mainProduct[0].name
          )
            ? singleSchematicFanCoilHeatPump
            : /boiler/i.test(mainProduct[0].name)
              ? singleSchematicBoiler
              : singleSchematicBoiler;

          // Step 3.b
          sendProgress("progress", {
            step: "Getting product details...",
            percentage: 40,
          });

          const shopifyMainProduct = await getShopifyMainProduct(
            mainProduct[0].sku
          );

          const productVariant =
            shopifyMainProduct.data.productVariants.edges[0]?.node?.product;

          if (!productVariant?.description) {
            throw new Error(
              "Main product does not have description, select another or send bug report"
            );
          }

          const mainProductDescription = productVariant.description;

          // Step 3.c
          sendProgress("progress", {
            step: "Generating AI content...",
            percentage: 50,
          });

          const aiResponse = await createAIDescription(mainProductDescription);

          if (!aiResponse?.data?.slogan || !aiResponse?.data?.description) {
            throw new Error("Invalid AI response: Missing required data");
          }
          const properties = {
            single_product_schematic: productSchematic,
            quote_bg_img: mainProduct[0].image,
            single_product_name: mainProduct[0].name,
            single_slogan_inline: aiResponse.data.slogan,
            single_product_description: aiResponse.data.description,
            main_product_sku: mainProduct[0].sku,
            filled_form_date: today,
          };

          // Step 3.d
          sendProgress("progress", {
            step: "Updating new quote properties...",
            percentage: 60,
          });

          await patchContactProperties(contactId, properties);
        }

        // Step 4
        sendProgress("progress", {
          step: "Fetching Shopify variants...",
          percentage: 75,
        });

        const shopifyItems = newLineItems;
        console.log("Shopify Items:", shopifyItems);

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

        // Step 5
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
          step: "Approving quote...",
          percentage: 95,
        });

        const setApproved = await setQuote(quoteId, "APPROVED");
        console.log("Quote set to APPROVAL:", setApproved);

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
