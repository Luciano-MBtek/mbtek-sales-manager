import { getDealById } from "@/actions/deals/getDealsById";
import { GetContactById } from "@/actions/getContactById";
import StepOneForm from "./StepOneForm";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

export default async function Page({ params }: Props) {
  const { id, dealId } = await params;
  const dealData = await getDealById(dealId, true);
  const contactData = await GetContactById(id, true);

  const initialData = {
    yearOfConstruction: dealData?.properties?.year_of_construction || "",
    insulationType: dealData?.properties?.insulation_type || "",
    specificNeeds:
      dealData?.properties?.specific_needs?.split(";").filter(Boolean) || [],
    otherSpecificNeed: dealData?.properties?.other_specific_need || "",
    installationResponsible:
      dealData?.properties?.installation_responsible || "",
  };

  return (
    <div className="p-4">
      <StepOneForm dealId={dealId} contactId={id} initialData={initialData} />
    </div>
  );
}
