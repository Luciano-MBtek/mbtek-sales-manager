"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import QuoteBillingContent from "@/components/Modals/TechnicalInformation/QuoteBillingContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";

interface StepFourFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
}

export default function StepFourForm({ dealId, contactId, initialData }: StepFourFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: any) => {
    await patchDealProperties(dealId, {
      billing_zip: data.zipCode,
      billing_first_name: data.firstName,
      billing_last_name: data.lastName,
      billing_email: data.email,
      billing_phone: data.phone,
      billing_address: data.address,
      billing_city: data.city,
      billing_state: data.state,
      billing_country: data.country,
      last_step: "step-5",
    });
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/step-five`);
  };

  return (
    <QuoteBillingContent
      onComplete={handleComplete}
      initialData={initialData}
      formRef={formRef}
    />
  );
}
