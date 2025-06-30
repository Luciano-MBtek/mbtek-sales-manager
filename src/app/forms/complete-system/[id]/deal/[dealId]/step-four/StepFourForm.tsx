"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import QuoteBillingContent from "@/components/Modals/TechnicalInformation/QuoteBillingContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";

interface StepFourFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
}

export default function StepFourForm({
  dealId,
  contactId,
  initialData,
}: StepFourFormProps) {
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

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleBack = () => {
    router.push(
      `/forms/complete-system/${contactId}/deal/${dealId}/step-three`
    );
  };

  return (
    <div className="space-y-6">
      <QuoteBillingContent
        onComplete={handleComplete}
        initialData={initialData}
        formRef={formRef}
      />

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>

        <Button type="button" onClick={handleSubmit}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
