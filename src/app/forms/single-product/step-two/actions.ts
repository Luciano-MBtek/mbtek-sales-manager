"use server";
import { Commodity, getFreightwiseRates } from "@/actions/getFreightwiseRates";
import { searchProducts } from "@/actions/searchProductsById";
import {
  RatesType,
  stepTwoSingleProductSchema,
} from "@/schemas/singleProductSchema";
import { singleProductRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepTwoFormSingleProductAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const productsData = formData.get("products");
  const products = productsData ? JSON.parse(productsData.toString()) : null;
  const leadData = formData.get("lead_data");
  const lead = leadData ? JSON.parse(leadData.toString()) : null;
  const splitPayment = formData.get("splitPayment");

  const data = { products, splitPayment };
  let rates: RatesType = [];

  if (lead.country === "USA") {
    if (products && Array.isArray(products)) {
      try {
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
          console.log(rate);
          rates = rate;
        } else {
          console.log("None products with Freighwise data");
        }
      } catch (error) {
        console.error("Error searching for products:", error);
      }
    }
  }

  const dataWithRates = { ...data, rates };

  const validated = stepTwoSingleProductSchema.safeParse(dataWithRates);

  const searchParams = new URLSearchParams();
  if (Array.isArray(rates) && rates.length > 0) {
    searchParams.set("rates", JSON.stringify(rates));
    console.log(JSON.stringify(rates));
  }

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(
    `${singleProductRoutes.REVIEW_SINGLE_PRODUCT}?${searchParams.toString()}`
  );
};
