"use server";

import { revalidatePath } from "next/cache";

type DealProperties = {
  [key: string]: string | number | boolean;
};

export async function patchDealProperties(
  dealId: string,
  properties: DealProperties
): Promise<any> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error(
        "HUBSPOT_API_KEY is not defined in the environment variables."
      );
    }

    const body = {
      properties,
    };

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/deals/${dealId}`,
      {
        method: "PATCH",
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
        `Error updating the Deal: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const dealData = await response.json();

    revalidatePath("/mydeals");
    return dealData;
  } catch (error) {
    console.error("Error in patchDealProperties:", error);
    throw new Error(
      `Failed to update the Deal: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
