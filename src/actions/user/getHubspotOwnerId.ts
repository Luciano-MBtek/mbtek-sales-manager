import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export const getHubspotOwnerIdSession = async () => {
  const session = await getServerSession(authOptions);

  const hubspotId = session?.user?.hubspotOwnerId;

  if (!hubspotId) {
    throw new Error(
      "No hubspot Owner Id, try login again or contact developer."
    );
  }
  return hubspotId;
};
