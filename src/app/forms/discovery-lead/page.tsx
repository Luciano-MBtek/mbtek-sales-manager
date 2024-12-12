import { collectDataRoutes } from "@/types";
import { redirect } from "next/navigation";

export default function FormsPage() {
  redirect(collectDataRoutes.DISCOVERY_CALL);
}
