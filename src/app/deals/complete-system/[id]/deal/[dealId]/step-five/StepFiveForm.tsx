"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  const handleComplete = async (data: ShippingFormValues) => {
    setLoading(true);
    await patchDealProperties(
      dealId,
      convertShippingFormToUpdateData(data, "meeting")
    );
    setLoading(false);
    router.push(`/deals/complete-system/${contactId}/deal/${dealId}/meeting`);
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleBack = () => {
    router.push(`/deals/complete-system/${contactId}/deal/${dealId}/step-four`);
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

        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
