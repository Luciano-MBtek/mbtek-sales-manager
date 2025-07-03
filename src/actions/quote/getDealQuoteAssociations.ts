"use server";

import pLimit from "p-limit";
import { QuoteAssociated } from "@/types/quoteTypes";

// Config
const API = "https://api.hubapi.com";
const BATCH_SIZE = 100; // HubSpot batch limit
const limiter = pLimit(6); // stay well below burst limit (10 r/s)

// Helper para dividir arrays en chunks
const chunk = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// Función para hacer fetches a HubSpot
const hubFetch = (
  url: string,
  init: RequestInit = {},
  revalidate: number = 300
) =>
  fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",

      ...(init.headers || {}),
    },
    next: { revalidate, tags: ["quotes"] },
  });

/**
 * Obtiene las asociaciones entre deals y quotes en batch
 * @param dealIds Array de IDs de deals
 * @returns Map con las asociaciones de cada deal a sus quotes
 */
export async function getDealQuoteAssociations(dealIds: string[]) {
  // Inicializar un Map para guardar las asociaciones
  const assocMap = new Map<string, { quotes: { id: string }[] }>();
  dealIds.forEach((id) => assocMap.set(id, { quotes: [] }));

  // Procesar en batches
  await Promise.all(
    chunk(dealIds, BATCH_SIZE).map((ids) =>
      limiter(async () => {
        const res = await hubFetch(
          `${API}/crm/v3/associations/deals/quotes/batch/read`,
          {
            method: "POST",
            body: JSON.stringify({ inputs: ids.map((id) => ({ id })) }),
          },
          300
        );

        if (!res.ok) throw new Error("association batch: " + res.statusText);

        const { results } = await res.json(); // [{ from:{id}, to:[{id}] }]
        results.forEach((row: any) => {
          assocMap.set(row.from.id, { quotes: row.to });
        });
      })
    )
  );

  return assocMap;
}

/**
 * Función auxiliar para obtener solo los IDs de quotes asociados a un deal
 * @param dealId ID del deal
 * @returns Array de IDs de quotes
 */
export async function getQuotesByDealIdBatch(
  dealIds: string[]
): Promise<Map<string, string[]>> {
  try {
    const associationsMap = await getDealQuoteAssociations(dealIds);

    // Convertir el mapa de asociaciones a un mapa de dealId -> quoteIds[]
    const quoteIdsMap = new Map<string, string[]>();

    dealIds.forEach((dealId) => {
      const association = associationsMap.get(dealId);
      if (association) {
        quoteIdsMap.set(
          dealId,
          association.quotes.map((quote) => quote.id)
        );
      } else {
        quoteIdsMap.set(dealId, []);
      }
    });

    return quoteIdsMap;
  } catch (error) {
    console.error("Error getting quotes by deal IDs in batch:", error);
    // Si hay error, devolver un mapa con arrays vacíos
    const errorMap = new Map<string, string[]>();
    dealIds.forEach((id) => errorMap.set(id, []));
    return errorMap;
  }
}
