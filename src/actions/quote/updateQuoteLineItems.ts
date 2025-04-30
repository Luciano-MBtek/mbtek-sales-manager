"use server";

import { LineItem } from "@/types/dealTypes";
import { HS } from "@/lib/hubspotRoute";

/**
 * Detacha los line-items actuales y asocia los nuevos en una sola pasada.
 * @param quoteId         ID de la quote
 * @param oldLineItemIds  IDs que hay que quitar (ya vienen del caller)
 * @param newLineItems    Objetos recién creados cuyos IDs hay que adjuntar
 */
export async function updateQuoteLineItems(
  quoteId: string,
  oldLineItemIds: string[],
  newLineItems: LineItem[]
) {
  /* Helpers locales ------------------------------------------------------- */
  async function detachAll(ids: string[]) {
    if (!ids.length) return { success: true, message: "No items to detach" };

    const response = await fetch(
      `${HS.base}/crm/v3/associations/quote/line_item/batch/archive`,
      {
        method: "POST",
        headers: HS.headers,
        body: JSON.stringify({
          inputs: ids.map((id) => ({
            from: { id: quoteId },
            to: { id },
            type: "68",
          })),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          `Failed to detach line items: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`
        );
      } catch (parseError) {
        throw new Error(
          `Failed to detach line items: ${response.status} ${response.statusText} - Raw response: ${errorText}`
        );
      }
    }

    // Verifica si hay contenido antes de intentar parsearlo
    const text = await response.text();
    if (!text || text.trim() === "") {
      return { success: true, data: null };
    }

    try {
      const data = JSON.parse(text);
      return { success: true, data };
    } catch (e) {
      console.warn("Response was not valid JSON, returning raw text:", text);
      return { success: true, data: { rawResponse: text } };
    }
  }

  async function attachNew(ids: string[]) {
    if (!ids.length) return { success: true, message: "No items to attach" };

    const response = await fetch(
      `${HS.base}/crm/v3/associations/quote/line_item/batch/create`,
      {
        method: "POST",
        headers: HS.headers,
        body: JSON.stringify({
          inputs: ids.map((id) => ({
            from: { id: quoteId },
            to: { id },
            type: "67",
          })),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          `Failed to attach line items: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`
        );
      } catch (parseError) {
        throw new Error(
          `Failed to attach line items: ${response.status} ${response.statusText} - Raw response: ${errorText}`
        );
      }
    }

    // Verifica si hay contenido antes de intentar parsearlo
    const text = await response.text();
    if (!text || text.trim() === "") {
      return { success: true, data: null };
    }

    try {
      const data = JSON.parse(text);
      return { success: true, data };
    } catch (e) {
      console.warn("Response was not valid JSON, returning raw text:", text);
      return { success: true, data: { rawResponse: text } };
    }
  }

  /* Flow principal -------------------------------------------------------- */
  try {
    // 1 •  Desasociar lo viejo
    const detachResult = await detachAll(oldLineItemIds);

    // 2 •  Asociar lo nuevo
    const newIds = newLineItems.map((li) => li.id);
    const attachResult = await attachNew(newIds);

    return {
      success: true,
      removed: oldLineItemIds.length,
      added: newIds.length,
      detachResult,
      attachResult,
    };
  } catch (error) {
    console.error("Error updating quote line items:", error);
    throw new Error(
      `Failed to update quote line items: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
