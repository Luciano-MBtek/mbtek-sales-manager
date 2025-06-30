import { getDealById } from "@/actions/deals/getDealsById";
import { GetContactById } from "@/actions/getContactById";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

export default async function Page({ params }: Props) {
  const { id, dealId } = await params;
  const dealData = await getDealById(dealId, true);
  const contactData = await GetContactById(id, true);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Review Information</h2>
      <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
        {JSON.stringify({ contact: contactData, deal: dealData }, null, 2)}
      </pre>
    </div>
  );
}
