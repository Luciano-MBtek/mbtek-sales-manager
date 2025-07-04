"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import BuildingNeedsContent from "@/components/Modals/TechnicalInformation/BuildingNeedsContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";
import {
  BuildingNeedsFormValues,
  convertBuildingFormToUpdateData,
} from "@/types/complete-system/buildingTypes";

interface StepOneFormProps {
  dealId: string;
  contactId: string;
  initialData: Partial<BuildingNeedsFormValues>;
}

export default function StepOneForm({
  dealId,
  contactId,
  initialData,
}: StepOneFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: BuildingNeedsFormValues) => {
    await patchDealProperties(
      dealId,
      convertBuildingFormToUpdateData(data, "zones-information")
    );
    router.push(`/deals/complete-system/${contactId}/deal/${dealId}/step-two`);
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
      <BuildingNeedsContent
        onComplete={handleComplete}
        initialData={initialData}
        formRef={formRef}
      />

      {/* Botones de navegación */}
      <div className="flex items-center justify-end mt-8 pt-4 border-t border-gray-200">
        <Button type="button" onClick={handleSubmit}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
