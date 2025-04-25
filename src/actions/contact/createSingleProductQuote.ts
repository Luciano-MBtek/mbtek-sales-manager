"use server";

import { newSingleProductType } from "@/schemas/singleProductSchema";
import { patchContactProperties } from "../patchContactProperties";
import { createDeal } from "./createDeal";
import { getHubspotOwnerIdSession } from "../user/getHubspotOwnerId";
import { createLineItems } from "./createLineItems";
import getShopifyMainProduct from "./getShopifyMainProduct";
import { createSingleProductData } from "../openAi/createSingleProductData";
import { getHubspotOwnerId } from "../getOwnerId";
import { getOwnerExtraData } from "../getOwnerExtraData";
import { buildSimpleQuote } from "../quote/buildSimpleQuote";
import { getDate } from "@/lib/utils";
import { fetchShopifyVariants } from "./fetchShopifyVariants";
import { createDraftOrder } from "./createDraftOrder";
import { createDownpayCart, getPurchaseOptions } from "./createDownpayCart";
import { patchDealProperties } from "./patchDealProperties";

interface SingleProductQuote {
  singleProduct: newSingleProductType;
  onProgress?: (step: string, percentage: number) => void;
}

const today = getDate();

export const createSingleProductQuote = async ({
  singleProduct,
  onProgress,
}: SingleProductQuote) => {
  try {
    const {
      id,
      name,
      email,
      lastname,
      address,
      zip,
      country,
      city,
      splitPayment,
      products,
      shipmentCost,
      purchaseOptionId,
    } = singleProduct;

    let province;
    let state;
    if (country === "USA") {
      state = singleProduct.state;
    } else if (country === "Canada") {
      province = singleProduct.province;
    }
    const sellingPlanId = purchaseOptionId;
    const userId = await getHubspotOwnerIdSession();
    const totalProducts = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const totalAmount = totalProducts + (Number(shipmentCost) || 0);

    onProgress?.("Getting owner information...", 15);
    const ownerData = await getHubspotOwnerId(userId);
    const { phone, jobtitle } = await getOwnerExtraData(ownerData.email);
    onProgress?.("Processing product information...", 20);

    const mainProduct = products.filter((product) => product.isMain === true);

    const singleSchematicFanCoilHeatPump =
      "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Generic-Schematics/Generic%20Schematic-1.svg";

    const singleSchematicBoiler =
      "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Generic-Schematics/Boiler%20-%20Radiant%20Heat.svg";

    const productSchematic = /heat pump|fan coil/i.test(mainProduct[0].name)
      ? singleSchematicFanCoilHeatPump
      : /boiler/i.test(mainProduct[0].name)
        ? singleSchematicBoiler
        : singleSchematicBoiler;
    onProgress?.("Creating deal...", 25);

    const dealData = await createDeal(
      id,
      name,
      lastname,
      userId,
      totalAmount,
      Number(shipmentCost)
    );
    onProgress?.("Creating line items...", 35);
    const lineItemsData = await createLineItems(dealData.id, products);

    onProgress?.("Getting product details...", 40);

    const shopifyMainProduct = await getShopifyMainProduct(mainProduct[0].sku);

    const productVariant =
      shopifyMainProduct.data.productVariants.edges[0]?.node?.product;

    if (!productVariant?.description) {
      throw new Error(
        "Main product does not have description, select another or send bug report"
      );
    }

    const mainProductDescription = productVariant.description;
    onProgress?.("Generating AI content...", 50);

    const aiResponse = await createSingleProductData(mainProductDescription);

    if (!aiResponse?.data?.slogan || !aiResponse?.data?.description) {
      throw new Error("Invalid AI response: Missing required data");
    }

    const properties = {
      address: address,
      zip: zip,
      city: city,
      split_payment: splitPayment,
      country_us_ca: country,
      ...(country === "USA"
        ? { state_usa: state }
        : country === "Canada"
          ? { province_territory: province }
          : {}),
      single_product_schematic: productSchematic,
      quote_bg_img: mainProduct[0].image,
      single_product_name: mainProduct[0].name,
      single_slogan_inline: aiResponse.data.slogan,
      single_product_description: aiResponse.data.description,
      filled_form_date: today,
    };
    onProgress?.("Updating contact properties...", 85);

    patchContactProperties(id, properties);

    const shopifyItems = products.map((product) => ({
      sku: product.sku,
      quantity: product.quantity,
      unitDiscount: product.unitDiscount,
    }));

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
      phone: phone || "",
      hubspot_owner_id: {
        fullname: `${ownerData.firstName} ${ownerData.lastName}`,
      },
    };

    const quoteTitle = `${name} ${lastname} - Standard quote`;
    // Create Draft order and pass the url later , instead of the shipment cost to buildSimpleQuote.

    let paymentUrl = "";
    let paymentType = "";

    // Create either draft order or downpay cart based on splitPayment
    if (splitPayment === "No") {
      // Create regular draft order for full payment
      onProgress?.("Creating Shopify draft order...", 85);
      const draftOrderResult = await createDraftOrder(
        variantLineItems,
        contactData,
        quoteTitle,
        Number(shipmentCost) || undefined
      );
      paymentUrl = draftOrderResult.invoiceUrl;
      paymentType = "draft";
    } else {
      // Create downpay cart with financing options
      onProgress?.("Creating downpayment cart...", 85);

      // Get the first purchase option by default

      // Get the first option's first purchase option ID

      // Create cart lines with selling plan ID
      const cartLines = variantLineItems.map((item) => ({
        quantity: item.quantity,
        merchandiseId: `gid://shopify/ProductVariant/${item.variant_id}`,
        sellingPlanId: `gid://shopify/SellingPlan/${sellingPlanId}`,
      }));

      // Create the cart
      const cartResult = await createDownpayCart(cartLines, contactData);
      paymentUrl = cartResult.checkoutUrl;
      paymentType = "cart";
    }

    onProgress?.("Updating Deal...", 90);

    const dealProperty = {
      shopify_draft_order_url: paymentUrl,
    };

    // PatchDeal with paymentURL
    patchDealProperties(dealData.id, dealProperty);

    onProgress?.("Building quote...", 95);
    // Build the quote with the payment URL
    const quoteBuilded = await buildSimpleQuote(
      id,
      name,
      lastname,
      dealData.id,
      ownerData.email,
      ownerData.firstName,
      ownerData.lastName,
      phone,
      jobtitle,
      paymentUrl, // Pass the payment URL (either invoice URL or checkout URL)
      lineItemsData.results
    );

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
