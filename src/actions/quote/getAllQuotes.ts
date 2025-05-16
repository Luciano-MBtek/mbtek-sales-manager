"use server";

import { Quote, QuoteAssociated } from "@/types/quoteTypes";
import { getQuoteById } from "./getQuoteById";

const apiKey = process.env.HUBSPOT_API_KEY;

export async function getAllQuotes(contactId: string): Promise<Quote[]> {
  try {
    const quotesAssociated = await getQuoteById(contactId);

    if (quotesAssociated.length === 0) {
      console.log("No deals associated with the contact were found.");
      return [];
    }

    const quoteDetailsPromises = quotesAssociated.map((quote) =>
      getQuoteDetails(quote)
    );
    const quoteData = await Promise.all(quoteDetailsPromises);

    const validQuotes = quoteData.filter((quote) => quote !== null);

    return validQuotes;
  } catch (error) {
    console.error("Error in Getting all quotes:", error);
    throw new Error("Could not retrieve all the quote information.");
  }
}

async function getQuoteDetails(quoteId: string): Promise<Quote | null> {
  const url = `https://api.hubapi.com/crm/v3/objects/quotes/${quoteId}?properties=hs_quote_amount&properties=hs_status&properties=hs_quote_link&properties=hs_title&properties=hs_expiration_date&properties=hs_terms&properties=hs_pdf_download_link`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["quotes"],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in get Quotes for the contact ${quoteId}:`, error);
    return null;
  }
}
