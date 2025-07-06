"use server";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { manageLineItems } from "@/actions/deals/manageLineItems";
import { getFreightwiseRates } from "@/actions/getFreightwiseRates";
import { searchProducts } from "@/actions/searchProductsById";
import { getDatePlus30Days } from "@/lib/utils";
import { stepOneCompleteSystemSchema } from "@/schemas/completeSystemSchema";
import { RatesType } from "@/schemas/singleProductSchema";
import { FormErrors } from "@/types";
import { DealProperties } from "@/types/dealTypes";
import { redirect } from "next/navigation";

export const stepOneCompleteSystemAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const productsData = formData.get("products");
  const products = productsData ? JSON.parse(productsData.toString()) : null;
  const splitPayment = formData.get("splitPayment");
  const purchaseOptionId = formData.get("purchaseOptionId")?.toString() || "";
  const dealId = formData.get("dealId")?.toString() || "";
  const contactId = formData.get("contactId")?.toString() || "";
  const leadData = formData.get("lead_data");
  const lead = leadData ? JSON.parse(leadData.toString()) : null;

  const data = {
    products,
    splitPayment,
    purchaseOptionId: splitPayment === "Yes" ? purchaseOptionId : "",
    dealId,
    contactId,
  };

  const validated = stepOneCompleteSystemSchema.safeParse(data);

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});

    return errors;
  }

  const mainProduct = products.find((product: any) => product.isMain === true);
  const mainProductSku = mainProduct?.sku || "";

  // Prepare deal properties update
  const dealProperties: Partial<DealProperties> = {
    split_payment: splitPayment?.toString() || "",
    purchase_option_id: purchaseOptionId,
  };

  // Only add main_product if we found one with isMain = true
  if (mainProductSku) {
    dealProperties.main_product = mainProductSku;
  }

  // Update the deal properties
  try {
    await patchDealProperties(dealId, dealProperties);
    console.log("Deal updated with split_payment and main product SKU");
  } catch (error) {
    console.error("Error updating deal properties:", error);
    return {
      products: "Failed to update deal properties. Please try again.",
    };
  }

  let rates: RatesType = [];

  if (products && Array.isArray(products)) {
    try {
      // Search for products with custom filter for ip__shopify__tags
      const tagFilter = {
        propertyName: "ip__shopify__tags",
        operator: "HAS_PROPERTY",
      };

      const productDetails = await Promise.all(
        products.map((product) => searchProducts(product.id, [tagFilter]))
      );

      const flattenedProducts = productDetails.flat();

      // Check if all products have "Free shipping" tag
      const allProductsHaveFreeShipping =
        flattenedProducts.length > 0 &&
        flattenedProducts.every((product) => {
          if (!product.properties || !product.properties.ip__shopify__tags) {
            return false;
          }

          // Split tags by comma and check if "Free shipping" exists (case insensitive)
          const tags = product.properties.ip__shopify__tags
            .split(",")
            .map((tag: string) => tag.trim().toLowerCase());

          return tags.includes("free shipping");
        });

      // If all products have free shipping tag, set free shipping rate
      if (allProductsHaveFreeShipping) {
        console.log(
          "All products have Free shipping tag, setting shipping cost to 0"
        );
        rates = [
          {
            costLoaded: 0,
            carrierScac: "Free",
            estimatedDeliveryDate: new Date(getDatePlus30Days()).toISOString(),
          },
        ];
      }
      // Otherwise calculate shipping rates if in USA
      else if (lead.country === "USA") {
        const productDetails = await Promise.all(
          products.map((product) => searchProducts(product.id))
        );
        const flattenedProducts = productDetails.flat();
        const validProducts = productDetails.some((result) => result !== 0);
        if (validProducts) {
          const { firstname, lastname, address, city, state, zip, country } =
            lead;
          const now = new Date();
          const shipDate = now.toISOString().split("T")[0];
          const to = {
            name: firstname + " " + lastname,
            address,
            city,
            state,
            zipcode: zip,
            country,
          };
          const productProperties: any = flattenedProducts.map(
            (product) => product.properties
          );

          const commodities = productProperties
            .filter((product: any) => product !== undefined)
            .map((product: any) => {
              const originalProduct = products.find(
                (p: any) => p.name === product.name
              );

              return {
                name: product.name,
                partNumber: product.hs_sku,
                class: Number(product.class),
                nmfc: product.nmfc,
                quantity: originalProduct
                  ? Number(originalProduct.quantity)
                  : 0,
                weight: Number(product.weight),
                dimensions: {
                  length: Number(product.length),
                  width: Number(product.width),
                  height: Number(product.height),
                },
                uom: product.uom,
              };
            });

          const body = {
            shipDate,
            to,
            commodities,
          };

          const rate = await getFreightwiseRates(body);
          const validRates = rate.filter(
            (rateItem: any) => rateItem.estimatedDeliveryDate
          );
          rates = validRates;
        } else {
          console.log("None products with Freighwise data");
        }
      }
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  }

  const dataWithRates = { ...data, rates };

  try {
    await manageLineItems(dealId, products);
  } catch (error) {
    console.error("Error managing line items:", error);
    return {
      products: "Failed to update product line items. Please try again.",
    };
  }

  const searchParams = new URLSearchParams();
  if (Array.isArray(rates) && rates.length > 0) {
    searchParams.set("rates", JSON.stringify(rates));
  }

  redirect(
    `/deals/complete-system/${contactId}/quote/${dealId}/step-two?${searchParams.toString()}`
  );
};
