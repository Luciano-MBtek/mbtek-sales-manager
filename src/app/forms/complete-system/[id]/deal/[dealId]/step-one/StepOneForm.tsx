"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import BuildingNeedsContent from "@/components/Modals/TechnicalInformation/BuildingNeedsContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";

interface StepOneFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
}

export default function StepOneForm({ dealId, contactId, initialData }: StepOneFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: any) => {
    await patchDealProperties(dealId, {
      year_of_construction: Number(data.yearOfConstruction),
      insulation_type: data.insulationType,
      specific_needs: data.specificNeeds.join(";"),
      other_specific_need: data.otherSpecificNeed || "",
      installation_responsible: data.installationResponsible,
      last_step: "zones-information",
    });
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/step-two`);
  };

  return (
    <BuildingNeedsContent
      onComplete={handleComplete}
      initialData={initialData}
      formRef={formRef}
    />
  );
}
