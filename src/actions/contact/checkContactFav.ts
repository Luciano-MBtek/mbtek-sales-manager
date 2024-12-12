"use server";

import { db } from "@/lib/db";
import { getUserIdSession } from "../user/getUserIdSession";

export async function checkContactFav(hubspotId: string) {
  const userId = await getUserIdSession();

  if (!userId) {
    return false;
  }

  try {
    const lead = await db.lead.findUnique({
      where: { hubspotId },
      include: {
        favoriteBy: {
          where: {
            userId: BigInt(userId),
          },
        },
      },
    });

    return Boolean(lead?.favoriteBy && lead.favoriteBy.length > 0);
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
}
