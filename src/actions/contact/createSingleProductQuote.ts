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
}

const today = getDate();

export const createSingleProductQuote = async ({
  singleProduct,
}: SingleProductQuote) => {
  try {
    const {
      id,
      name,
      lastname,
      email,
      address,
      zip,
      country,
      city,
      splitPayment,
      products,
    } = singleProduct;

    let province;
    let state;
    if (country === "USA") {
      state = singleProduct.state;
    } else if (country === "Canada") {
      province = singleProduct.province;
    }

    const userId = await getHubspotOwnerIdSession();

    const ownerData = await getHubspotOwnerId(userId);
    const { phone, jobtitle } = await getOwnerExtraData(ownerData.email);

    const mainProduct = products.filter((product) => product.isMain === true);

    const singleSchematicFanCoilHeatPump =
      "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Generic%20Schematic-1.svg";

    const singleSchematicBoiler =
      "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Boiler%20-%20Radiant%20Heat.svg";

    const productSchematic = /heat pump|fan coil/i.test(mainProduct[0].name)
      ? singleSchematicFanCoilHeatPump
      : /boiler/i.test(mainProduct[0].name)
        ? singleSchematicBoiler
        : undefined;

    const dealData = await createDeal(id, name, lastname, userId);

    const lineItemsData = await createLineItems(dealData.id, products);

    const shopifyMainProduct = await getShopifyMainProduct(mainProduct[0].sku);

    const mainProductDescription =
      shopifyMainProduct.data.productVariants.edges[0].node.product.description;

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

    patchContactProperties(id, properties);

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
      lineItemsData.results
    );

    return { success: true, quoteUrl: quoteBuilded.data };
  } catch (error) {
    console.error("Error in createSingleProductQuote:", error);
    throw new Error(
      "Failed to create single product quote: " + (error as Error).message
    );
  }
};
