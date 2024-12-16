import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export const getUserIdSession = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  return userId;
};
