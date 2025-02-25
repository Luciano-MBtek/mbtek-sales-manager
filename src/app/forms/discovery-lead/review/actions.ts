"use server";
import { createContact } from "@/actions/createContact";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

import {
  newLeadType,
  stepTwoSchema,
  stepOneSchema,
  stepThreeSchemaB2C,
  stepFourSchema,
} from "@/schemas/newLeadSchema";
import { collectDataRoutes } from "@/types";
import { revalidatePath } from "next/cache";
import { searchContact } from "@/actions/searchContact";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { triggerLeadQualificationWebhook } from "@/actions/webhooks/leadQualificationWebhook";
import { createContactProperties } from "@/lib/utils";

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

    const contactExist = await searchContact(contact.email, "email");

    if (contactExist !== 0) {
      if (!contactExist.properties.hubspot_owner_id) {
        const properties = createContactProperties(contact, ownerId);

        const response = await patchContactProperties(
          contactExist.id,
          properties
        );

        if (!response?.id) {
          return {
            errorMsg: "Failed to update contact properties",
            success: false,
          };
        }
      } else {
        const properties = createContactProperties(contact);
        const response = await patchContactProperties(
          contactExist.id,
          properties
        );

        if (!response?.id) {
          return {
            errorMsg: "Failed to update contact properties",
            success: false,
          };
        }
      }

      const webhook = await triggerLeadQualificationWebhook(contactExist.id);

      if (!webhook) {
        return {
          errorMsg:
            "Failed to trigger webhook for workflow on hubspot, contact developer.",
          success: false,
        };
      }

      revalidatePath(`/contacts/${contactExist.id}`);
      revalidatePath(`/contacts/${contactExist.id}/properties`);
      revalidatePath(`/contacts/${contactExist.id}/deals`);
      revalidatePath(`/contacts/${contactExist.id}/quotes`);

      return {
        success: true,
        redirect1: `/contacts/${contactExist.id}`,
        redirect2: collectDataRoutes.DISCOVERY_CALL,
      };
    }

    if (contactExist === 0) {
      const response = await createContact(contact, ownerId);
      if (!response.success) {
        return {
          errorMsg: response.error,
          success: false,
        };
      }
      revalidatePath(`/contacts/${response.contactId}`);
      revalidatePath(`/contacts/${response.contactId}/properties`);
      revalidatePath(`/contacts/${response.contactId}/deals`);
      revalidatePath(`/contacts/${response.contactId}/quotes`);
      return {
        success: true,
        redirect1: `/contacts/${response.contactId}`,
        redirect2: collectDataRoutes.DISCOVERY_CALL,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      errorMsg: "Failed to create contact",
      success: false,
    };
  }
  return {
    errorMsg: "Unexpected error occurred",
    success: false,
  };
};
