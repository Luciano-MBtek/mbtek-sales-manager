import { completeSystemRoutes } from "@/types";
import { redirect } from "next/navigation";

export default function FormsPage() {
  redirect(completeSystemRoutes.GENERAL_SYSTEM_DATA);
}
