import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

const QuoteCreationPage = async ({ params }: Props) => {
  const { dealId, id } = await params;

  const stepOne = `/forms/complete-system/${id}/quote/${dealId}/step-one`;

  redirect(stepOne);
};

export default QuoteCreationPage;
