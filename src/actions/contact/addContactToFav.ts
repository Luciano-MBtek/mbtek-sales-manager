"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getUserIdSession } from "../user/getUserIdSession";

export async function addContactToFav(contactData: {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}) {
  const userId = await getUserIdSession();

  try {
    // Primero buscamos o creamos el Lead
    const lead = await db.lead.upsert({
      where: {
        hubspotId: contactData.id,
      },
      create: {
        hubspotId: contactData.id,
        name: `${contactData.firstname} ${contactData.lastname}`,
        email: contactData.email,
      },
      update: {
        name: `${contactData.firstname} ${contactData.lastname}`,
        email: contactData.email,
      },
    });

    // Verificamos si ya existe en favoritos para evitar duplicados
    const existingFavorite = await db.userFavoriteLead.findFirst({
      where: {
        userId: BigInt(userId),
        leadId: lead.id,
      },
    });

    if (!existingFavorite) {
      await db.userFavoriteLead.create({
        data: {
          userId: BigInt(userId),
          leadId: lead.id,
        },
      });
    }

    revalidateTag("user-data");

    return { success: true };
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    throw new Error("Error al agregar el contacto a favoritos");
  }
}
