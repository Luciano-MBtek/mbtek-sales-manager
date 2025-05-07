"use server";

import { db } from "@/lib/db";
import { Prisma, Role } from "@prisma/client";
import { getHubspotOwnerId } from "../getOwnerId";

/**
 * Devuelve el hubspotOwnerId del próximo manager en round‑robin.
 */
export async function getNextManagerId(): Promise<string> {
  try {
    console.log("getNextManagerId: Iniciando búsqueda de manager");
    // 1. Ejecutamos todo lo crítico dentro de una transacción SERIAlizable
    const { email } = await db.$transaction(
      async (tx) => {
        try {
          console.log("getNextManagerId: Iniciando transacción");
          // -- a) Garantizar que exista la fila de estado ------------------------
          const state = await tx.roundRobinState.upsert({
            where: { id: 1 },
            update: {}, // nada que cambiar si existe
            create: { id: 1 }, // lastManagerId = null por default
            select: { lastManagerId: true },
          });
          console.log("getNextManagerId: Estado obtenido:", state);

          const lastId = state.lastManagerId ?? BigInt(0);
          console.log("getNextManagerId: lastId:", lastId.toString());

          // -- b) Buscar al siguiente manager por ID ----------------------------
          let nextManager = await tx.user.findFirst({
            where: {
              accessLevel: Role.manager,
              id: { gt: lastId }, // solo los que tienen ID mayor
            },
            orderBy: { id: "asc" },
            select: { id: true, email: true },
          });
          console.log(
            "getNextManagerId: Búsqueda de manager con ID > lastId:",
            nextManager
          );

          //       Si no hay uno "mayor", volvemos al primero (wrap‑around)
          if (!nextManager) {
            console.log(
              "getNextManagerId: No se encontró manager con ID mayor, buscando el primero"
            );
            nextManager = await tx.user.findFirst({
              where: { accessLevel: Role.manager },
              orderBy: { id: "asc" },
              select: { id: true, email: true },
            });
            console.log(
              "getNextManagerId: Primer manager encontrado:",
              nextManager
            );
            if (!nextManager)
              throw new Error("No managers found in the system");
          }

          // -- c) Actualizar el estado ------------------------------------------
          await tx.roundRobinState.update({
            where: { id: 1 },
            data: { lastManagerId: nextManager.id },
          });
          console.log(
            "getNextManagerId: Estado actualizado con lastManagerId:",
            nextManager.id.toString()
          );

          // Solo devolvemos lo que necesitamos fuera de la transacción
          return { email: nextManager.email };
        } catch (error) {
          console.error("Transaction error:", error);
          throw error; // Re-throw to trigger transaction rollback
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    console.log(
      "getNextManagerId: Transacción completada, email del manager:",
      email
    );
    // 2. Fuera de la transacción (menos bloqueo en la BD)
    const id = await getHubspotOwnerId(email);
    console.log("getNextManagerId: ID de HubSpot obtenido:", id);
    return id;
  } catch (error) {
    console.error("Error in getNextManagerId:", error);
    throw new Error(
      `Failed to get next manager ID: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
