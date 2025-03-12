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
import { buildSimpleQuote } from "./buildSimpleQuote";
import { getDate } from "@/lib/utils";

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
      lastname,
      address,
      zip,
      country,
      city,
      splitPayment,
      products,
      shipmentCost,
    } = singleProduct;

    let province;
    let state;
    if (country === "USA") {
      state = singleProduct.state;
    } else if (country === "Canada") {
      province = singleProduct.province;
    }

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

    const mainProductDescription =
      shopifyMainProduct.data.productVariants.edges[0].node.product.description;
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
    onProgress?.("Building quote...", 90);

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
      shipmentCost,
      lineItemsData.results
    );

    return { success: true, quoteUrl: quoteBuilded.data };
  } catch (error) {
    console.error("Error in createSingleProductQuote:", error);
    throw new Error(
      "Failed to create Standard Quote: " + (error as Error).message
    );
  }
};
