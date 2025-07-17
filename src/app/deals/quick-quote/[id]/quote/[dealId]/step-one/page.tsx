import { getDealById } from "@/actions/deals/getDealsById";
import { GetContactById } from "@/actions/getContactById";
import StepOneQuickQuoteForm from "./StepOneQuickQuoteForm";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

export default async function Page({ params }: Props) {
  const { id, dealId } = await params;
  const dealData = await getDealById(dealId, true);
  const contactData = await GetContactById(id, true);

  const initialData = {
    zipCode: contactData?.properties?.zip || "",
    firstName: contactData?.properties?.firstname || "",
    lastName: contactData?.properties?.lastname || "",
    email: contactData?.properties?.email || "",
    phone: contactData?.properties?.phone || "",
    address: contactData?.properties?.address || "",
    city: contactData?.properties?.city || "",
    state: contactData?.properties?.state || "",
    country: contactData?.properties?.country || "",
  };

  return (
    <div className="p-4">
      <StepOneQuickQuoteForm
        dealId={dealId}
        contactId={id}
        initialData={initialData}
      />
    </div>
  );
}
