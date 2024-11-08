"use server";
import {
  newLeadType,
  stepTwoSchema,
  stepOneSchema,
  stepThreeSchemaB2C,
  stepFourSchema,
} from "@/schemas/newLeadSchema";
import { collectDataRoutes } from "@/types";


interface SubmitLeadActionReturnType {
  redirect1?: string;
  redirect2?: collectDataRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitLeadAction = async (
  deal: newLeadType
): Promise<SubmitLeadActionReturnType> => {
  const stepOneValidated = stepOneSchema.safeParse(deal);
  if (!stepOneValidated.success) {
    return {
      redirect2: collectDataRoutes.DISCOVERY_CALL,
      errorMsg: "Please validate step one.",
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(deal);
  if (!stepTwoValidated.success) {
    return {
      redirect2: collectDataRoutes.DISCOVERY_CALL_2,
      errorMsg: "Please validate step two.",
    };
  }

  const stepThreeB2CValidated = stepThreeSchemaB2C.safeParse(deal);
  if (!stepThreeB2CValidated.success) {
    return {
      redirect2: collectDataRoutes.LEAD_QUALIFICATION_B2C,
      errorMsg: "Please validate step 3 (B2C).",
    };
  }

  const stepFourSchemaValidated = stepFourSchema.safeParse(deal);
  if (!stepFourSchemaValidated.success) {
    return {
      redirect2: collectDataRoutes.REVIEW_LEAD,
      errorMsg: "Please validate step four.",
    };
  }
  const retVal = {
    success: true,
    redirect1: "/forms/single-product",
    redirect2: collectDataRoutes.DISCOVERY_CALL,
  };

  return retVal;
};
