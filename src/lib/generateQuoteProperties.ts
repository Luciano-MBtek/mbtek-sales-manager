import getShopifyMainProduct from "@/actions/contact/getShopifyMainProduct";
import { createAIDescription } from "@/actions/openAi/createAIresponse";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { Product } from "@/types";
import { getDate } from "./utils";

export async function generateQuoteProperties(
  newMainProduct: boolean,
  products: Product[],
  contactId: string
) {
  const today = getDate();
  if (!newMainProduct) return;

  // Find the main product from products
  const mainProduct = products.filter(
    (product: Product) => product.isMain === true
  );

  const singleSchematicFanCoilHeatPump =
    "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Generic-Schematics/Generic%20Schematic-1.svg";

  const singleSchematicBoiler =
    "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Generic-Schematics/Boiler%20-%20Radiant%20Heat.svg";

  const productSchematic = /heat pump|fan coil/i.test(mainProduct[0].name)
    ? singleSchematicFanCoilHeatPump
    : /boiler/i.test(mainProduct[0].name)
      ? singleSchematicBoiler
      : singleSchematicBoiler;

  // Get product details
  const shopifyMainProduct = await getShopifyMainProduct(mainProduct[0].sku);

  const productVariant =
    shopifyMainProduct.data.productVariants.edges[0]?.node?.product;

  if (!productVariant?.description) {
    throw new Error(
      "Main product does not have description, select another or send bug report"
    );
  }

  const mainProductDescription = productVariant.description;

  // Generate AI content
  const aiResponse = await createAIDescription(mainProductDescription);

  if (!aiResponse?.data?.slogan || !aiResponse?.data?.description) {
    throw new Error("Invalid AI response: Missing required data");
  }

  // Create properties object to update contact
  const properties = {
    single_product_schematic: productSchematic,
    quote_bg_img: mainProduct[0].image,
    single_product_name: mainProduct[0].name,
    single_slogan_inline: aiResponse.data.slogan,
    single_product_description: aiResponse.data.description,
    main_product_sku: mainProduct[0].sku,
    filled_form_date: today,
  };

  // Update contact properties
  await patchContactProperties(contactId, properties);

  return properties;
}
