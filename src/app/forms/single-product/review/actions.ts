"use server";
import { createSingleProductQuote } from "@/actions/contact/createSingleProductQuote";
import {
  stepTwoSingleProductSchema,
  stepOneProductSchema,
  newSingleProductType,
} from "@/schemas/singleProductSchema";
import { singleProductRoutes } from "@/types";
import { revalidatePath } from "next/cache";

interface SubmitLeadActionReturnType {
  redirect1?: string;
  redirect2?: singleProductRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitSingleProductAction = async (
  singleProduct: newSingleProductType
): Promise<SubmitLeadActionReturnType> => {
  console.log("Single Product:", singleProduct);
  const stepOneValidated = stepOneProductSchema.safeParse(singleProduct);

  if (!stepOneValidated.success) {
    return {
      redirect2: singleProductRoutes.SHIPPING_DATA,
      errorMsg: "Please validate step one.",
    };
  }

  const stepTwoValidated = stepTwoSingleProductSchema.safeParse(singleProduct);

  if (!stepTwoValidated.success) {
    console.log("deberia redirigir");
    return {
      redirect2: singleProductRoutes.PRODUCT_DATA,
      errorMsg: "Please validate step two.",
    };
  }

  const createQuote = await createSingleProductQuote({ singleProduct });

  console.log(createQuote);
  revalidatePath(`/contacts/${singleProduct.id}`);
  revalidatePath(`/contacts/${singleProduct.id}/properties`);

  const retVal = {
    success: true,
    // redirect1: "/contacts",
    redirect1: singleProductRoutes.SHIPPING_DATA,
    redirect2: singleProductRoutes.SHIPPING_DATA,
  };

  return retVal;
};
