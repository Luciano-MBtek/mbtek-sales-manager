"use server";
import { createContact } from "@/actions/createContact";

import { revalidatePath } from "next/cache";
import { searchContact } from "@/actions/searchContact";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { triggerLeadQualificationWebhook } from "@/actions/webhooks/leadQualificationWebhook";
import { createContactProperties } from "@/lib/utils";
import { StepQualificationOneFormValues } from "@/schemas/leadQualificationSchema";
import { getNextManagerId } from "./getNextManagerId";

interface CreateOrModifyReturnType {
  errorMsg?: string;
  success?: boolean;
  contactId?: string;
  ownerId?: string;
}

export const createOrModify = async (
  contact: StepQualificationOneFormValues
): Promise<CreateOrModifyReturnType> => {
  try {
    const ownerId = await getNextManagerId();

    if (!ownerId) {
      return {
        errorMsg: "Failed to assign a manager",
        success: false,
      };
    }

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

      // const webhook = await triggerLeadQualificationWebhook(contactExist.id);

      /* if (!webhook) {
        return {
          errorMsg:
            "Failed to trigger webhook for workflow on hubspot, contact developer.",
          success: false,
        };
      } */

      revalidatePath(`/contacts/${contactExist.id}`);
      revalidatePath(`/contacts/${contactExist.id}/properties`);
      revalidatePath(`/contacts/${contactExist.id}/deals`);
      revalidatePath(`/contacts/${contactExist.id}/quotes`);

      return {
        success: true,
        contactId: contactExist.id,
        ownerId: contactExist.hubspot_owner_id,
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
        contactId: response.contactId,
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
