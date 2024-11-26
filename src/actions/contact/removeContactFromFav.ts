"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export async function removeContactFromFav(hubspotId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

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
