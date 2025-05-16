import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export const getUserAccessToken = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    console.error("Access token not found.");
    return null;
  }
  const accessToken = session.accessToken as string;

  return accessToken;
};
