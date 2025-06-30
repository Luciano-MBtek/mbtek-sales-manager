"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import ShippingContent from "@/components/Modals/TechnicalInformation/ShippingContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";

interface StepFiveFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
  billingData: any;
}

export default function StepFiveForm({
  dealId,
  contactId,
  initialData,
  billingData,
}: StepFiveFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: any) => {
    await patchDealProperties(dealId, {
      shipping_first_name: data.shipping_first_name,
      shipping_last_name: data.shipping_last_name,
      shipping_email: data.shipping_email,
      shipping_phone: data.shipping_phone,
      shipping_address: data.shipping_address,
      shipping_city: data.shipping_city,
      shipping_country: data.shipping_country,
      shipping_province: data.shipping_province,
      shipping_zip_code: data.shipping_zip_code,
      delivery_type: data.delivery_type,
      dropoff_condition: data.dropoff_condition,
      last_step: "review",
    });
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/review`);
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
