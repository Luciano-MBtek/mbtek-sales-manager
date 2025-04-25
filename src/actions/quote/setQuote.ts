"use server";

const apiKey = process.env.HUBSPOT_API_KEY;

type QuoteStatus = "DRAFT" | "APPROVAL";

interface SetQuoteResult {
  success: boolean;
  message?: string;
}

/**
 * Updates the status of a quote in HubSpot
 * @param quoteId The ID of the quote to update
 * @param status The new status for the quote
 * @returns Promise with result object containing success status
 */
const setQuote = async (
  quoteId: string,
  status: QuoteStatus
): Promise<SetQuoteResult> => {
  if (!apiKey) {
    return {
      success: false,
      message: "HubSpot API key is not configured",
    };
  }

  try {
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/quotes/${quoteId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            hs_status: status,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: `Failed to update quote status: ${errorData.message || response.statusText}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating quote status:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export default setQuote;
