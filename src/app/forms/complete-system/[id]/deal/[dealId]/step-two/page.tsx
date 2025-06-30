import { getDealById } from "@/actions/deals/getDealsById";
import StepTwoForm from "./StepTwoForm";

export default async function Page({ params }: { params: { id: string; dealId: string } }) {
  const { id, dealId } = params;
  const dealData = await getDealById(dealId, true);

  const initialData = {
    numberOfZones: dealData?.properties?.number_of_zones || "1",
    zones: dealData?.properties?.zones_configuration
      ? JSON.parse(dealData.properties.zones_configuration)
      : [{ name: "", size: "", distribution: "" }],
  };

  return (
    <div className="p-4">
      <StepTwoForm dealId={dealId} contactId={id} initialData={initialData} />
    </div>
  );
}
