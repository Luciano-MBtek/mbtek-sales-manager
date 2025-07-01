import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
  searchParams: Promise<{ createQuote?: string }>;
};

const DealDetailPage = async ({ params, searchParams }: Props) => {
  const { dealId, id } = await params;
  const resolvedSearchParams = await searchParams;
  const isCreatingQuote = resolvedSearchParams?.createQuote === "true";

  const stepOne = `/forms/complete-system/${id}/deal/${dealId}/step-one`;
  const quote = "/forms/single-product/step-one";
  if (isCreatingQuote) {
    redirect(quote);
  }
  redirect(stepOne);
};

export default DealDetailPage;
