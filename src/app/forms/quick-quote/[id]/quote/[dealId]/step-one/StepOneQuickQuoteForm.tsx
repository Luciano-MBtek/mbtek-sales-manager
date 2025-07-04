"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import QuoteBillingContent from "@/components/Modals/TechnicalInformation/QuoteBillingContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";
import {
  BillingFormValues,
  convertBillingFormToUpdateData,
} from "@/types/complete-system/billingTypes";

interface StepOneQuickQuoteFormProps {
  dealId: string;
  contactId: string;
  initialData: Partial<BillingFormValues>;
}

export default function StepOneQuickQuoteForm({
  dealId,
  contactId,
  initialData,
}: StepOneQuickQuoteFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: BillingFormValues) => {
    await patchDealProperties(
      dealId,
      convertBillingFormToUpdateData(data, "step-two")
    );
    router.push(`/forms/quick-quote/${contactId}/quote/${dealId}/step-two`);
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <div className="space-y-6">
      <QuoteBillingContent
        onComplete={handleComplete}
        initialData={initialData}
        formRef={formRef}
      />
      <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
        <Button type="button" onClick={handleSubmit}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
