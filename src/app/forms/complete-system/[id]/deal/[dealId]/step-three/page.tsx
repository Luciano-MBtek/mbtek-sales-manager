import { getDealById } from "@/actions/deals/getDealsById";
import { getFilesById } from "@/actions/deals/getFilesById";
import StepThreeForm from "./StepThreeForm";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

export default async function Page({ params }: Props) {
  const { id, dealId } = await params;
  const dealData = await getDealById(dealId, true);

  let filesData: any[] = [];
  if (dealData?.properties.complete_system_documentation) {
    const { results } = await getFilesById(
      dealData.properties.complete_system_documentation.split(";")
    );
    filesData = results;
  }

  const initialData = filesData.map((file: any) => ({
    id: file.id,
    name: file.name,
    url: file.url,
  }));

  return (
    <div className="p-4">
      <StepThreeForm dealId={dealId} contactId={id} initialData={initialData} />
    </div>
  );
}
