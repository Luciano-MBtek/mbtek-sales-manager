"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DocumentationContent from "@/components/Modals/TechnicalInformation/DocumentationContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const handleComplete = async (_data: any) => {
    setLoading(true);
    await patchDealProperties(dealId, {
      last_step: "step-4",
    });
    setLoading(false);
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

        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
