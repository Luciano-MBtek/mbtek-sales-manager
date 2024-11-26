"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function checkContactFav(hubspotId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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
