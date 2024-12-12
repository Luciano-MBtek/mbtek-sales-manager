"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getUserIdSession } from "../user/getUserIdSession";

export async function removeContactFromFav(hubspotId: string) {
  const userId = await getUserIdSession();

  try {
    const lead = await db.lead.findUnique({
      where: { hubspotId },
    });

    if (!lead) {
      throw new Error("Lead no encontrado");
    }

    await db.userFavoriteLead.deleteMany({
      where: {
        userId: BigInt(userId),
        leadId: lead.id,
      },
    });

    revalidateTag("user-data");

    return { success: true };
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw new Error("Error al remover el contacto de favoritos");
  }
}
