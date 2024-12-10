"use server";

import { Deal, DealWithLineItems, LineItem } from "@/types/dealTypes";

export async function getAllDealsDataWithLineItems(
  contactId: string
): Promise<DealWithLineItems[]> {
  try {
    // Paso 1: Obtener los IDs de los deals asociados al contacto
    const dealIds = await getDealsByContactId(contactId);
    if (dealIds.length === 0) {
      console.log("No se encontraron deals asociados al contacto.");
      return [];
    }

    // Paso 2: Obtener los detalles de todos los deals en paralelo
    const dealDetailsPromises = dealIds.map((dealId) => getDealDetails(dealId));
    const dealsData = await Promise.all(dealDetailsPromises);

    // Filtrar los deals que se obtuvieron correctamente
    const validDeals = dealsData.filter((deal) => deal !== null);

    // Paso 3: Para cada deal, obtener los IDs de los line items asociados
    const dealsWithLineItemsPromises = validDeals.map(async (deal) => {
      const lineItemIds = await getLineItemsByDealId(deal.id);
      return { ...deal, lineItemIds };
    });

    const dealsWithLineItems = await Promise.all(dealsWithLineItemsPromises);

    // Paso 4: Para cada line item, obtener sus detalles
    const allLineItemsPromises: Promise<(LineItem | null)[]>[] = [];
    dealsWithLineItems.forEach((deal) => {
      const lineItemsPromises = deal.lineItemIds.map((lineItemId) =>
        getLineItemDetails(lineItemId)
      );
      allLineItemsPromises.push(Promise.all(lineItemsPromises));
    });

    const allLineItemsData = await Promise.all(allLineItemsPromises);

    // Paso 5: Combinar los line items con sus respectivos deals
    const finalDealsData = dealsWithLineItems.map((deal, index) => {
      const lineItems = allLineItemsData[index].filter(
        (lineItem) => lineItem !== null
      );
      return { ...deal, lineItems };
    });

    return finalDealsData;
  } catch (error) {
    console.error("Error en getAllDealsDataWithLineItems:", error);
    throw new Error(
      "No se pudo obtener toda la información de los deals y sus line items."
    );
  }
}

async function getDealsByContactId(contactId: string): Promise<string[]> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/deal?properties=dealname`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener asociaciones de deals: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return []; // No hay deals asociados
    }

    // Extraer los IDs de los deals
    return data.results.map((association: { id: string }) => association.id);
  } catch (error) {
    console.error("Error en getDealsByContactId:", error);
    throw new Error("No se pudo obtener los deals del contacto.");
  }
}

async function getDealDetails(dealId: string): Promise<Deal | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=quantity,price,dealname,hs_product_id,hs_images,createdate`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener detalles del deal ${dealId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en getDealDetails para el deal ${dealId}:`, error);
    return null; // Retornar null para manejar errores individualmente
  }
}

async function getLineItemsByDealId(dealId: string): Promise<string[]> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_item`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener asociaciones de line items para el deal ${dealId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return []; // No hay line items asociados
    }

    // Extraer los IDs de los line items
    return data.results.map((association: { id: string }) => association.id);
  } catch (error) {
    console.error(
      `Error en getLineItemsByDealId para el deal ${dealId}:`,
      error
    );
    return []; // Retornar un array vacío en caso de error
  }
}

async function getLineItemDetails(
  lineItemId: string
): Promise<LineItem | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  const url = `https://api.hubapi.com/crm/v3/objects/line_items/${lineItemId}?properties=quantity,price,name,hs_product_id,hs_images,createdate`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener detalles del line item ${lineItemId}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Error en getLineItemDetails para el line item ${lineItemId}:`,
      error
    );
    return null; // Retornar null para manejar errores individualmente
  }
}
