"use server";

import { getDatePlus7Days } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { dealStage, pipelineLabels } from "@/app/mydeals/utils";

export async function createDeal(
  contactId: string,
  firstName: string,
  lastName: string,
  ownerId: string,
  amount: number,
  shippingCost: number
): Promise<any> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error(
        "HUBSPOT_API_KEY is not defined in the environment variables."
      );
    }

    const dealName = `Quick quote ${firstName} ${lastName}`;
    const closeDate = getDatePlus7Days();

    const dealProperties = {
      dealname: dealName,
      hubspot_owner_id: ownerId,
      dealstage: dealStage["Quote sent"],
      pipeline: pipelineLabels["Mbtek - Instant Quote"],
      amount: amount,
      shipping_cost: shippingCost,
      closedate: closeDate,
    };

    const associations = [
      {
        to: contactId,
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 3,
          },
        ],
      },
    ];

    const body = {
      properties: dealProperties,
      associations,
    };

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/deals`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error creating the Deal: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const dealData = await response.json();
    const dealId = dealData.id;

    revalidatePath("/mydeals");
    return dealData;
  } catch (error) {
    console.error("Error in createDeal:", error);
    throw new Error(
      `Failed to create the Deal: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
