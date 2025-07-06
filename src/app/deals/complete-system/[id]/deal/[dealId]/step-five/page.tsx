import { getDealById } from "@/actions/deals/getDealsById";
import { GetContactById } from "@/actions/getContactById";
import StepFiveForm from "./StepFiveForm";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

export default async function Page({ params }: Props) {
  const { id, dealId } = await params;
  const dealData = await getDealById(dealId, true);
  const contactData = await GetContactById(id, true);

  const initialData = {
    delivery_type: dealData?.properties?.delivery_type || "",
    dropoff_condition: dealData?.properties?.dropoff_condition || "",
    shipping_first_name:
      dealData?.properties?.shipping_first_name ||
      contactData?.properties?.firstname ||
      "",
    shipping_last_name:
      dealData?.properties?.shipping_last_name ||
      contactData?.properties?.lastname ||
      "",
    shipping_email:
      dealData?.properties?.shipping_email ||
      contactData?.properties?.email ||
      "",
    shipping_phone:
      dealData?.properties?.shipping_phone ||
      contactData?.properties?.phone ||
      "",
    shipping_address:
      dealData?.properties?.shipping_address ||
      contactData?.properties?.shipping_address ||
      "",
    shipping_city:
      dealData?.properties?.shipping_city ||
      contactData?.properties?.shipping_city ||
      "",
    shipping_country:
      dealData?.properties?.shipping_country ||
      contactData?.properties?.shipping_country ||
      "",
    shipping_province:
      dealData?.properties?.shipping_province ||
      contactData?.properties?.shipping_province ||
      "",
    shipping_zip_code:
      dealData?.properties?.shipping_zip_code ||
      contactData?.properties?.shipping_zip_code ||
      "",
  };

  const billingData = {
    zipCode:
      dealData?.properties?.billing_zip || contactData?.properties?.zip || "",
    firstName:
      dealData?.properties?.billing_first_name ||
      contactData?.properties?.firstname ||
      "",
    lastName:
      dealData?.properties?.billing_last_name ||
      contactData?.properties?.lastname ||
      "",
    email:
      dealData?.properties?.billing_email ||
      contactData?.properties?.email ||
      "",
    phone:
      dealData?.properties?.billing_phone ||
      contactData?.properties?.phone ||
      "",
    address:
      dealData?.properties?.billing_address ||
      contactData?.properties?.address ||
      "",
    city:
      dealData?.properties?.billing_city || contactData?.properties?.city || "",
    state:
      dealData?.properties?.billing_state ||
      contactData?.properties?.state ||
      "",
    country:
      dealData?.properties?.billing_country ||
      contactData?.properties?.country ||
      "",
  };

  return (
    <div className="p-4">
      <StepFiveForm
        dealId={dealId}
        contactId={id}
        initialData={initialData}
        billingData={billingData}
      />
    </div>
  );
}
