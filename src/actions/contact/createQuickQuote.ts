"use server";

import { patchContactProperties } from "../patchContactProperties";
import getShopifyMainProduct from "./getShopifyMainProduct";
import { createAIDescription } from "@/actions/openAi/createAIresponse";
import { getHubspotOwnerId } from "../getOwnerId";
import { getOwnerExtraData } from "../getOwnerExtraData";
import { buildSimpleQuote } from "../quote/buildSimpleQuote";
import { getDate, sleep } from "@/lib/utils";
import { fetchShopifyVariants } from "./fetchShopifyVariants";
import { createDraftOrder } from "./createDraftOrder";
import { createDownpayCart } from "./createDownpayCart";
import { patchDealProperties } from "./patchDealProperties";
import { getDealLineItems } from "../deals/getDealLineItems";
import { newQuickQuoteType } from "@/schemas/quickQuoteSchema";

interface QuickQuote {
  quickQuote: newQuickQuoteType;
  onProgress?: (step: string, percentage: number) => void;
}

const today = getDate();

export const createQuickQuote = async ({
  quickQuote,
  onProgress,
}: QuickQuote) => {
  try {
    const {
      contactId,
      dealId,
      dealOwnerId,
      name,
      email,
      lastname,
      address,
      zip,
      phone: contactPhone,
      country,
      city,
      splitPayment,
      products,
      shipmentCost,
      purchaseOptionId,
    } = quickQuote;

    let province;
    let state;
    if (country === "USA") {
      state = quickQuote.state;
    } else if (country === "Canada") {
      province = quickQuote.province;
    }
    const sellingPlanId = purchaseOptionId;
    const totalProducts = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const totalAmount = totalProducts + (Number(shipmentCost) || 0);

    onProgress?.("Getting owner information...", 15);
    const ownerData = await getHubspotOwnerId(dealOwnerId);
    const { phone, jobtitle } = await getOwnerExtraData(ownerData.email);
    onProgress?.("Processing product information...", 20);

    const properties = {
      address: address,
      zip: zip,
      city: city,
      split_payment: splitPayment,
      phone: contactPhone,
      country_us_ca: country,
      ...(country === "USA"
        ? { state_usa: state }
        : country === "Canada"
          ? { province_territory: province }
          : {}),

      filled_form_date: today,
    };
    onProgress?.("Updating contact properties...", 35);

    await patchContactProperties(contactId, properties);

    const shopifyItems = products.map((product) => ({
      sku: product.sku,
      quantity: product.quantity,
      unitDiscount: product.unitDiscount,
    }));
    onProgress?.("Syncing with Shopify items...", 35);

    const variantLineItems = await fetchShopifyVariants(shopifyItems);

    const contactData = {
      firstname: name,
      lastname,
      email: email || "",
      address,
      city,
      state_usa: state,
      province,
      country_us_ca: country,
      zip,
      phone: contactPhone || "",
      hubspot_owner_id: {
        fullname: `${ownerData.firstName} ${ownerData.lastName}`,
      },
    };

    const quoteTitle = `${name} ${lastname} - Quote`;

    let paymentUrl = "";
    let paymentType = "";
    let orderId = "";

    // Create either draft order or downpay cart based on splitPayment
    if (splitPayment === "No") {
      /* Draft Order payment */
      onProgress?.("Creating Shopify draft order...", 55);
      const draftOrderResult = await createDraftOrder(
        variantLineItems,
        contactData,
        quoteTitle,
        Number(shipmentCost) || undefined
      );
      paymentUrl = draftOrderResult.invoiceUrl;
      orderId = draftOrderResult.draftOrderId;
      paymentType = "draft";
    } else {
      /* Downpay checkout */
      onProgress?.("Creating downpayment cart...", 55);

      // Get the first option's first purchase option ID

      // Create cart lines with selling plan ID
      const cartLines = variantLineItems.map((item) => ({
        quantity: item.quantity,
        merchandiseId: `gid://shopify/ProductVariant/${item.variant_id}`,
        sellingPlanId: `gid://shopify/SellingPlan/${sellingPlanId}`,
      }));

      const cartResult = await createDownpayCart(cartLines, contactData);
      paymentUrl = cartResult.checkoutUrl;
      paymentType = "cart";
    }

    onProgress?.("Updating Deal...", 70);

    const dealProperty = {
      shopify_draft_order_url: paymentUrl,
      shopify_draft_order_id: orderId || "",
      amount: totalAmount,
      shipping_cost: Number(shipmentCost),
    };

    patchDealProperties(dealId, dealProperty);

    const dealLineItems = await getDealLineItems(dealId, true);

    onProgress?.("Building quote...", 85);

    const quoteBuilded = await buildSimpleQuote(
      contactId,
      name,
      lastname,
      dealId,
      ownerData.email,
      ownerData.firstName,
      ownerData.lastName,
      phone, // This is the phone from the Sales Agent
      jobtitle,
      paymentUrl,
      false, // Builds Quick quote
      dealLineItems
    );

    sleep(3000);

    return {
      success: true,
      quoteUrl: quoteBuilded.data,
      paymentUrl,
      paymentType,
    };
  } catch (error) {
    console.error("Error in createSingleProductQuote:", error);
    throw new Error(
      "Failed to create Standard Quote: " + (error as Error).message
    );
  }
};
