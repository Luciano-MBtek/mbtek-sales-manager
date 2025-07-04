"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import DocumentationContent from "@/components/Modals/TechnicalInformation/DocumentationContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";

interface StepThreeFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
}

export default function StepThreeForm({
  dealId,
  contactId,
  initialData,
}: StepThreeFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (_data: any) => {
    await patchDealProperties(dealId, {
      last_step: "step-4",
    });
    router.push(`/deals/complete-system/${contactId}/deal/${dealId}/step-four`);
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleBack = () => {
    router.push(`/deals/complete-system/${contactId}/deal/${dealId}/step-two`);
  };

  return (
    <div className="space-y-6">
      <DocumentationContent
        onComplete={handleComplete}
        formRef={formRef}
        initialData={initialData}
        dealId={dealId}
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
