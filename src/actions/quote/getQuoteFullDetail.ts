"use server";

import { LineItem } from "@/types/dealTypes";
import { Quote, LineItemAssociation } from "@/types/quoteTypes";

const apiKey = process.env.HUBSPOT_API_KEY;

export async function getQuoteFullDetail(
  quoteId: string
): Promise<(Quote & { lineItems?: LineItem[] }) | null> {
  const url = `https://api.hubapi.com/crm/v3/objects/quotes/${quoteId}?associations=line_items&archived=false?properties=hs_quote_amount&properties=hs_status&properties=hs_quote_link&properties=hs_title&properties=hs_expiration_date&properties=hs_terms&properties=hs_pdf_download_link`;

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

    // Verificar si la quote tiene line items asociados
    if (
      data.associations &&
      data.associations["line items"] &&
      data.associations["line items"].results &&
      data.associations["line items"].results.length > 0
    ) {
      // Extraer los IDs de los line items
      const lineItemIds = data.associations["line items"].results.map(
        (association: LineItemAssociation) => association.id
      );

      // Obtener los detalles de cada line item
      const lineItemsPromises = lineItemIds.map((lineItemId: string) =>
        getLineItemDetails(lineItemId)
      );

      // Esperar a que se resuelvan todas las promesas
      const lineItems = await Promise.all(lineItemsPromises);

      // Filtrar los line items nulos (en caso de error)
      const validLineItems = lineItems.filter(
        (item): item is LineItem => item !== null
      );

      // Añadir los line items a la respuesta
      return {
        ...data,
        lineItems: validLineItems,
      };
    }

    return data;
  } catch (error) {
    console.error(`Error in getQuoteFullDetail for quote ${quoteId}:`, error);
    return null;
  }
}

// Función para obtener los detalles de un line item específico
async function getLineItemDetails(
  lineItemId: string
): Promise<LineItem | null> {
  const url = `https://api.hubapi.com/crm/v3/objects/line_items/${lineItemId}?associations=deal&properties=quantity,price,name,hs_product_id,hs_images,createdate,hs_discount_percentage,hs_sku`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["line-items"],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      console.error(
        `Error fetching line item details for ${lineItemId}: ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      `Error in getLineItemDetails for line item ${lineItemId}:`,
      error
    );
    return null;
  }
}
