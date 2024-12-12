"use server";
import { createContact } from "@/actions/createContact";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  contact: newLeadType
): Promise<SubmitLeadActionReturnType> => {
  const stepOneValidated = stepOneSchema.safeParse(contact);
  if (!stepOneValidated.success) {
    return {
      redirect2: collectDataRoutes.DISCOVERY_CALL,
      errorMsg: "Please validate step one.",
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(contact);
  if (!stepTwoValidated.success) {
    return {
      redirect2: collectDataRoutes.DISCOVERY_CALL_2,
      errorMsg: "Please validate step two.",
    };
  }

  const stepThreeB2CValidated = stepThreeSchemaB2C.safeParse(contact);
  if (!stepThreeB2CValidated.success) {
    return {
      redirect2: collectDataRoutes.LEAD_QUALIFICATION_B2C,
      errorMsg: "Please validate step 3 (B2C).",
    };
  }

  const stepFourSchemaValidated = stepFourSchema.safeParse(contact);
  if (!stepFourSchemaValidated.success) {
    return {
      redirect2: collectDataRoutes.REVIEW_LEAD,
      errorMsg: "Please validate step four.",
    };
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.hubspotOwnerId) {
      return {
        errorMsg: "User ID not found",
        success: false,
      };
    }

    const ownerId = session.user.hubspotOwnerId;

    const response = await createContact(contact, ownerId);
    if (!response.success) {
      return {
        errorMsg: response.error,
        success: false,
      };
    }

    return {
      success: true,
      redirect1: `/contacts/${response.contactId}`,
      redirect2: collectDataRoutes.DISCOVERY_CALL,
    };
  } catch (error) {
    console.error(error);
    return {
      errorMsg: "Failed to create contact",
      success: false,
    };
  }
};
