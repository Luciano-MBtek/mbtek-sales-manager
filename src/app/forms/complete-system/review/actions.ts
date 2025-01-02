"use server";

import {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  stepFiveSchema,
  stepSixSchema,
  CompleteSystemType,
} from "@/schemas/completeSystemSchema";
import { mainRoutes, completeSystemRoutes } from "@/types";
import { revalidatePath } from "next/cache";

interface SubmitLeadActionReturnType {
  redirect1?: string;
  redirect2?: string;
  errorMsg?: string;
  success?: boolean;
}

export const submitCompleteSystemAction = async (
  completeSystem: CompleteSystemType
): Promise<SubmitLeadActionReturnType> => {
  try {
    const stepOneValidated = stepOneSchema.safeParse(completeSystem);

    if (!stepOneValidated.success) {
      return {
        redirect2: completeSystemRoutes.GENERAL_SYSTEM_DATA,
        errorMsg: "Please validate step one.",
      };
    }

    const stepTwoValidated = stepTwoSchema.safeParse(completeSystem);

    if (!stepTwoValidated.success) {
      return {
        redirect2: completeSystemRoutes.MARKET_DATA,
        errorMsg: "Please validate step two.",
      };
    }
    const stepThreeValidated = stepThreeSchema.safeParse(completeSystem);

    if (!stepThreeValidated.success) {
      return {
        redirect2: completeSystemRoutes.BUILDING_DATA,
        errorMsg: "Please validate step three.",
      };
    }
    const stepFourValidated = stepFourSchema.safeParse(completeSystem);

    if (!stepFourValidated.success) {
      return {
        redirect2: completeSystemRoutes.PROJECT_PLANS,
        errorMsg: "Please validate step four.",
      };
    }

    const stepFiveValidated = stepFiveSchema.safeParse(completeSystem);

    if (!stepFiveValidated.success) {
      return {
        redirect2: completeSystemRoutes.SHIPPING_DATA,
        errorMsg: "Please validate step five.",
      };
    }

    const stepSixValidated = stepSixSchema.safeParse(completeSystem);

    if (!stepSixValidated.success) {
      return {
        redirect2: completeSystemRoutes.BOOKING_DATA,
        errorMsg: "Please validate step six.",
      };
    }

    return {
      success: true,
      redirect1: completeSystemRoutes.GENERAL_SYSTEM_DATA,
      redirect2: mainRoutes.CONTACTS,
    };
  } catch (error) {
    throw error;
  }
};
