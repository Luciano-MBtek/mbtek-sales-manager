"use server";

import { QuoteAssociated } from "@/types/quoteTypes";

const apiKey = process.env.HUBSPOT_API_KEY;

export const getQuoteById = async (id: string): Promise<QuoteAssociated> => {
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/${id}/associations/quotes`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching quote or quotes associated with contact: ${response.statusText}`
      );
    }

    const data = await response.json();

    const quotes = data.results.map((result: any) => result.id);
    return quotes;
  } catch (error) {
    console.error(
      `Error in getting the quote or quotes associated with contact`,
      error
    );
    return [];
  }
};
