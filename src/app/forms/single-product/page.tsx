import { singleProductRoutes } from "@/types";
import { redirect } from "next/navigation";

export default async function FormsPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const queryParams = new URLSearchParams({
    name: searchParams.name as string,
    lastname: searchParams.lastname as string,
    email: searchParams.email as string,
    country: searchParams.country as string,
    state: searchParams.state as string,
  }).toString();

  redirect(`${singleProductRoutes.SHIPPING_DATA}?${queryParams}`);
}
