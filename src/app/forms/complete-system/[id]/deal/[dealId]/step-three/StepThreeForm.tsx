"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import DocumentationContent from "@/components/Modals/TechnicalInformation/DocumentationContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";

interface StepThreeFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
}

export default function StepThreeForm({ dealId, contactId, initialData }: StepThreeFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (_data: any) => {
    await patchDealProperties(dealId, {
      last_step: "step-4",
    });
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/step-four`);
  };

  return (
    <DocumentationContent
      onComplete={handleComplete}
      formRef={formRef}
      initialData={initialData}
      dealId={dealId}
    />
  );
}
