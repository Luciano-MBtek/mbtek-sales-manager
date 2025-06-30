import { getDealById } from "@/actions/deals/getDealsById";
import { GetContactById } from "@/actions/getContactById";
import StepFourForm from "./StepFourForm";

export default async function Page({ params }: { params: { id: string; dealId: string } }) {
  const { id, dealId } = params;
  const dealData = await getDealById(dealId, true);
  const contactData = await GetContactById(id, true);

  const initialData = {
    zipCode: dealData?.properties?.billing_zip || contactData?.properties?.zip || "",
    firstName: dealData?.properties?.billing_first_name || contactData?.properties?.firstname || "",
    lastName: dealData?.properties?.billing_last_name || contactData?.properties?.lastname || "",
    email: dealData?.properties?.billing_email || contactData?.properties?.email || "",
    phone: dealData?.properties?.billing_phone || contactData?.properties?.phone || "",
    address: dealData?.properties?.billing_address || contactData?.properties?.address || "",
    city: dealData?.properties?.billing_city || contactData?.properties?.city || "",
    state: dealData?.properties?.billing_state || contactData?.properties?.state || "",
    country: dealData?.properties?.billing_country || contactData?.properties?.country || "",
  };

  return (
    <div className="p-4">
      <StepFourForm dealId={dealId} contactId={id} initialData={initialData} />
    </div>
  );
}
