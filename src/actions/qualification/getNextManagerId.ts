"use server";

import { db } from "@/lib/db";
import { Prisma, Role } from "@prisma/client";
import { getHubspotOwnerId } from "../getOwnerId";

/**
 * Returns the hubspotOwnerId of the next manager in round‑robin.
 */
export async function getNextManagerId(): Promise<string> {
  try {
    const { email } = await db.$transaction(
      async (tx) => {
        try {
          const state = await tx.roundRobinState.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1 },
            select: { lastManagerId: true },
          });

          const lastId = state.lastManagerId ?? BigInt(0);

          let nextManager = await tx.user.findFirst({
            where: {
              accessLevel: Role.sales_agent,
              id: { gt: lastId },
            },
            orderBy: { id: "asc" },
            select: { id: true, email: true },
          });

          if (!nextManager) {
            nextManager = await tx.user.findFirst({
              where: { accessLevel: Role.sales_agent },
              orderBy: { id: "asc" },
              select: { id: true, email: true },
            });

            if (!nextManager)
              throw new Error("No managers found in the system");
          }

          await tx.roundRobinState.update({
            where: { id: 1 },
            data: { lastManagerId: nextManager.id },
          });

          return { email: nextManager.email };
        } catch (error) {
          console.error("Transaction error:", error);
          throw error;
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    const id = await getHubspotOwnerId(email);
    console.log("getNextManagerId: HubSpot ID obtained:", id);
    return id;
  } catch (error) {
    console.error("Error in getNextManagerId:", error);
    throw new Error(
      `Failed to get next manager ID: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
