"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import ZonesInformationContent from "@/components/Modals/TechnicalInformation/ZonesInformationContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";
import { Button } from "@/components/ui/button";

interface StepTwoFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
}

export default function StepTwoForm({
  dealId,
  contactId,
  initialData,
}: StepTwoFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: any) => {
    await patchDealProperties(dealId, {
      number_of_zones: data.numberOfZones,
      zones_configuration: JSON.stringify(data.zones),
      last_step: "step-3",
    });
    router.push(
      `/forms/complete-system/${contactId}/deal/${dealId}/step-three`
    );
  };
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleBack = () => {
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/step-one`);
  };

  return (
    <div className="space-y-6">
      <ZonesInformationContent
        onComplete={handleComplete}
        initialData={initialData}
        formRef={formRef}
      />

      {/* Botones de navegación */}
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
