"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getAllUsers = unstable_cache(
  async () => {
    try {
      const userData = await db.user.findMany();

      if (!userData) {
        throw new Error("Usuario no encontrado");
      }

      console.log(userData);

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
  ["all-users-data"],
  {
    revalidate: 3600,
    tags: ["all-users-data"],
  }
);
