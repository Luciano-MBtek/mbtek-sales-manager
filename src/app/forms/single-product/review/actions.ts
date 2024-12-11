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
  try {
    const stepOneValidated = stepOneProductSchema.safeParse(singleProduct);

    if (!stepOneValidated.success) {
      return {
        redirect2: singleProductRoutes.SHIPPING_DATA,
        errorMsg: "Please validate step one.",
      };
    }

    const stepTwoValidated =
      stepTwoSingleProductSchema.safeParse(singleProduct);

    if (!stepTwoValidated.success) {
      return {
        redirect2: singleProductRoutes.PRODUCT_DATA,
        errorMsg: "Please validate step two.",
      };
    }

    const createQuote = await createSingleProductQuote({
      singleProduct,
    });

    revalidatePath(`/contacts/${singleProduct.id}`);
    revalidatePath(`/contacts/${singleProduct.id}/properties`);
    revalidatePath(`/contacts/${singleProduct.id}/deals`);
    revalidatePath(`/contacts/${singleProduct.id}/quotes`);

    return {
      success: true,
      redirect1: createQuote.quoteUrl,
      redirect2: singleProductRoutes.SHIPPING_DATA,
    };
  } catch (error) {
    throw error;
  }
};
