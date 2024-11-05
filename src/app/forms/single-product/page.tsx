import { singleProductRoutes } from "@/types";
import { redirect } from "next/navigation";

export default function FormsPage() {
  redirect(singleProductRoutes.SHIPPING_DATA);
}
