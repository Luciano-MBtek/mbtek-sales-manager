"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import ZonesInformationContent from "@/components/Modals/TechnicalInformation/ZonesInformationContent";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";

interface StepTwoFormProps {
  dealId: string;
  contactId: string;
  initialData: any;
}

export default function StepTwoForm({ dealId, contactId, initialData }: StepTwoFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleComplete = async (data: any) => {
    await patchDealProperties(dealId, {
      number_of_zones: data.numberOfZones,
      zones_configuration: JSON.stringify(data.zones),
      last_step: "step-3",
    });
    router.push(`/forms/complete-system/${contactId}/deal/${dealId}/step-three`);
  };

  return (
    <ZonesInformationContent
      onComplete={handleComplete}
      initialData={initialData}
      formRef={formRef}
    />
  );
}
