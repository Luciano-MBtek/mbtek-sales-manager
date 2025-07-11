"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BuildingNeedsContent from "@/components/Modals/TechnicalInformation/BuildingNeedsContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";
import {
  BuildingNeedsFormValues,
  convertBuildingFormToUpdateData,
} from "@/types/complete-system/buildingTypes";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const handleComplete = async (data: BuildingNeedsFormValues) => {
    setLoading(true);
    await patchDealProperties(
      dealId,
      convertBuildingFormToUpdateData(data, "zones-information")
    );
    setLoading(false);
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
        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
