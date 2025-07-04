"use server";

import { getDatePlus30Days } from "@/lib/utils";

const completeSystemTemplate = "364369694331";
const quickQuoteTemplate = "360901336075";

const quoteExpiration = getDatePlus30Days();

type LineItem = {
  id: string;
  properties: {
    hs_object_id?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};

export async function buildSimpleQuote(
  contactId: string,
  firstName: string,
  lastName: string,
  dealId: string,
  ownerEmail: string,
  ownerFirstName: string,
  ownerLastname: string,
  ownerPhone: string,
  ownerJob: string,
  cartOrderUrl: string,
  completeSystem: boolean,
  lineItems?: LineItem[]
): Promise<any> {
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;

    if (!apiKey) {
      throw new Error(
        "HUBSPOT_API_KEY is not defined in the environment variables."
      );
    }

    const lineItemAssociations = lineItems?.length
      ? lineItems.map((item) => ({
          to: {
            id: item.id || item.properties.hs_object_id,
          },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 67,
            },
          ],
        }))
      : [];

    const quoteProperties = {
      hs_title: `${firstName + " " + lastName} -  ${completeSystem ? "Complete System" : "Quick quote"}`,
      hs_expiration_date: quoteExpiration,
      hs_status: "APPROVED",
      hs_sender_email: ownerEmail,
      hs_sender_firstname: ownerFirstName,
      hs_sender_lastname: ownerLastname,
      hs_sender_phone: ownerPhone,
      hs_sender_jobtitle: ownerJob ? ownerJob : "Product Solution Specialist",
      hs_currency: "USD",
      hs_terms: cartOrderUrl,
    };

    const associations = [
      {
        to: {
          id: contactId,
        },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 69,
          },
        ],
      },
      {
        to: {
          id: completeSystem ? completeSystemTemplate : quickQuoteTemplate, // CHANGE THIS TO TEST WITH BACKUP QUOTE
        },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 286,
          },
        ],
      },
      {
        to: {
          id: dealId,
        },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 64,
          },
        ],
      },
      ...(lineItems?.length ? lineItemAssociations : []),
    ];

    const body = {
      properties: quoteProperties,
      associations,
    };

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/quote`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        redirect: "follow",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error creating the Quote: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    } else {
      const jsonData = await response.json();
      const quoteUrl =
        jsonData.properties.hs_domain +
        "/" +
        jsonData.properties.hs_proposal_slug;

      return { message: "Quote successfully created", data: quoteUrl };
    }
  } catch (error) {
    console.error("Error in Standard Quote Creation:", error);
    throw new Error(
      `Failed to create the Quote: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
