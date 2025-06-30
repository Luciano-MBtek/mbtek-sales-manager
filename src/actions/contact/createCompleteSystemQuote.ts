"use server";
import { Product } from "@/types";
import { createLineItems } from "./createLineItems";
import { buildSimpleQuote } from "../quote/buildSimpleQuote";
import { getHubspotOwnerIdSession } from "../user/getHubspotOwnerId";
import { getHubspotOwnerId } from "../getOwnerId";
import { getOwnerExtraData } from "../getOwnerExtraData";
import { GetContactById } from "../getContactById";
import { patchDealProperties } from "./patchDealProperties";

interface CompleteSystemQuoteProps {
  dealId: string;
  contactId: string;
  products: Product[];
  onProgress?: (step: string, percentage: number) => void;
}

export const createCompleteSystemQuote = async ({
  dealId,
  contactId,
  products,
  onProgress,
}: CompleteSystemQuoteProps) => {
  try {
    onProgress?.("Creating line items...", 20);
    const lineItemsData = await createLineItems(dealId, products);

    onProgress?.("Fetching contact data...", 30);
    const contact = await GetContactById(contactId, true);

    const userId = await getHubspotOwnerIdSession();
    const ownerData = await getHubspotOwnerId(userId);
    const { phone, jobtitle } = await getOwnerExtraData(ownerData.email);

    onProgress?.("Building quote...", 80);
    const quoteBuilded = await buildSimpleQuote(
      contactId,
      contact.properties.firstname,
      contact.properties.lastname,
      dealId,
      ownerData.email,
      ownerData.firstName,
      ownerData.lastName,
      phone,
      jobtitle,
      "",
      lineItemsData.results
    );

    onProgress?.("Updating deal...", 95);
    await patchDealProperties(dealId, {
      quote_url: quoteBuilded.data,
      last_step: "completed",
    });

    return { success: true, quoteUrl: quoteBuilded.data };
  } catch (error) {
    console.error("Error in createCompleteSystemQuote:", error);
    throw new Error(
      "Failed to create Complete System Quote: " + (error as Error).message
    );
  }
};
