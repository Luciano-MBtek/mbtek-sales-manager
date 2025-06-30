import { getDealById } from "@/actions/deals/getDealsById";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};
const page = async ({ params }: Props) => {
  const { dealId } = await params;
  const dealData = getDealById(dealId);
  console.log("Deal Data:", dealData);
  return <div className="text-primary">Step one</div>;
};

export default page;
