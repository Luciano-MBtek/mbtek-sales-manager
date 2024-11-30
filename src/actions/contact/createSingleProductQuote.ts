"use server";

import { newSingleProductType } from "@/schemas/singleProductSchema";
import { patchContactProperties } from "../patchContactProperties";
import { createDeal } from "./createDeal";
import { getHubspotOwnerIdSession } from "../user/getHubspotOwnerId";

interface SingleProductQuote {
  singleProduct: newSingleProductType;
}

export const createSingleProductQuote = async ({
  singleProduct,
}: SingleProductQuote) => {
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

  console.log("ID DE OWNER:", userId);

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
  };

  patchContactProperties(id, properties);

  const dealData = await createDeal(id, name, lastname, userId);

  console.log(dealData);
};
