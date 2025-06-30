import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

const DealDetailPage = async ({ params }: Props) => {
  const { dealId, id } = await params;

  const stepOne = `/forms/complete-system/${id}/deal/${dealId}/step-one`;

  redirect(stepOne);
};

export default DealDetailPage;
