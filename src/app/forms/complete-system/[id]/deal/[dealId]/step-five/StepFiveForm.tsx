"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";
import { BillingFormValues } from "@/types/complete-system/billingTypes";
import {
  convertShippingFormToUpdateData,
  ShippingFormValues,
} from "@/types/complete-system/shippingTypes";
import ShippingContent from "@/components/Modals/TechnicalInformation/ShippingContent";

interface StepFiveFormProps {
  dealId: string;
  contactId: string;
  initialData: Partial<ShippingFormValues>;
  billingData: Partial<BillingFormValues>;
}

export default function StepFiveForm({
  dealId,
  contactId,
  initialData,
  billingData,
}: StepFiveFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: ShippingFormValues) => {
    await patchDealProperties(
      dealId,
      convertShippingFormToUpdateData(data, "meeting")
    );
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/meeting`);
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleBack = () => {
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/step-four`);
  };

  return (
    <div className="space-y-6">
      <ShippingContent
        onComplete={handleComplete}
        initialData={initialData}
        billingData={billingData}
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
