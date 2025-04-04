"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { getUserIdSession } from "./getUserIdSession";

const getUserDataByIdCached = unstable_cache(
  async (userId: string) => {
    try {
      const userData = await db.user.findUnique({
        where: {
          id: parseInt(userId),
        },
        include: {
          activities: {
            orderBy: { activityDate: "desc" },
            take: 5,
          },
          favoriteLeads: {
            include: { lead: true },
            take: 5,
          },
          recentLeads: {
            include: { lead: true },
            orderBy: { accessedAt: "desc" },
            take: 5,
          },
        },
      });

      if (!userData) {
        throw new Error("Usuario no encontrado");
      }

      return JSON.parse(
        JSON.stringify(userData, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      throw error;
    }
  },
  ["user-data"],
  {
    revalidate: 3600,
    tags: ["user-data"],
  }
);

export async function getUserDataById() {
  const userId = await getUserIdSession();
  return getUserDataByIdCached(userId);
}
