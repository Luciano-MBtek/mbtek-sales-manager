"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QualificationModal } from "@/components/Modals/LeadQualification/QualificationModal";

import {
  QualificationData,
  QualificationStep,
  useQualificationStore,
} from "@/store/qualification-store";
import { getCurrentQualificationStep } from "@/components/LeadsQualifier/leadQualificationProgress";
import { LeadProps } from "@/types";

interface QualificationButtonProps {
  lead?: LeadProps;
  buttonLabel?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function QualificationButton({
  lead,
  buttonLabel = "Start new Qualification",
  className,
  variant = "default",
}: QualificationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateData, setStep, resetData } = useQualificationStore();

  const handleOpenModal = () => {
    if (lead) {
      resetData();

      const leadData = mapLeadToQualificationData(lead);

      updateData(leadData);

      const step = determineStartingStep(lead.properties);
      setStep(step);
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpenModal} className={className} variant={variant}>
        {buttonLabel}
      </Button>
      <QualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

function mapLeadToQualificationData(lead: {
  id: string;
  properties: Record<string, any>;
}): QualificationData {
  const props = lead.properties;

  const parseArrayProperty = (
    value: string | string[] | undefined
  ): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch (e) {
      return value.includes(";") ? value.split(";") : [value];
    }
  };

  return {
    contactId: lead.id,
    ownerId: props.hubspot_owner_id,
    name: props.firstname || "",
    lastname: props.lastname || "",
    email: props.email || "",
    phone: props.phone || "",
    zipCode: props.zip || "",
    country: props.country_us_ca || "",
    state: props.state_usa || "",
    province: props.province_territory || "",
    city: props.city || "",
    address: props.address || "",
    leadType: props.lead_type || "",
    hearAboutUs: props.hear_about_us || "",
    currentSituation: parseArrayProperty(props.current_situation),
    lookingFor: props.looking_for || "",
    lead_owner_id: props.hubspot_owner_id || props.lead_owner_id || "",
    building_type: props.building_type || "",
    project_type: props.project_type || "",
    current_system_type: props.current_system_type || null,
    system_age: props.system_age || null,
    main_project_goals: parseArrayProperty(props.main_project_goals),
    competitors_previously_contacted:
      props.competitors_previously_contacted || "",
    competitors_name: props.competitors_name || "",
    desired_timeframe: props.desired_timeframe || "",
    decisive_timing_factor: parseArrayProperty(props.decisive_timing_factor),
    other_timing_factor: props.other_timing_factor || "",
    decision_making_status: props.decision_making_status || "",
    property_type: props.property_type || "",
    type_of_decision: props.type_of_decision || "",
    additional_comments: props.additional_comments || "",
    defined_a_budget: props.defined_a_budget || "",
    budget_range: props.budget_range || "",
    aware_of_available_financial_incentives:
      props.aware_of_available_financial_incentives || "",
    planned_financial_method: props.planned_financial_method || "",
    bant_score: props.bant_score || "",
    hs_lead_status: props.hs_lead_status || "",
    disqualification_reason: props.disqualification_reason || "",
    disqualification_explanation: props.disqualification_explanation || "",
    shipping_address: props.shipping_address || "",
    shipping_city: props.shipping_city || "",
    shipping_state: props.shipping_state || "",
    shipping_zip_code: props.shipping_zip_code || "",
    shipping_country: props.shipping_country || "",
    shipping_notes: props.shipping_notes || "",
    meetings: {
      meetingIds: props.meetings.meetingIds || [],
      upcoming: props.meetings.upcoming || null,
    },
  };
}

function determineStartingStep(
  properties: Record<string, any>
): QualificationStep {
  if (properties.meetings && properties.meetings.upcoming) {
    return "meeting";
  }

  // Map the step number to the corresponding step type
  const stepMap: Record<number, QualificationStep> = {
    1: "step-one",
    2: "step-two",
    3: "step-three",
    4: "step-four",
    5: "step-five",
    6: "step-six",
    7: "step-seven",
    8: "meeting",
  };

  const currentStepNumber = getCurrentQualificationStep(properties);

  console.log("currentStepNumber", currentStepNumber);

  if (currentStepNumber >= 1 && currentStepNumber <= 8) {
    return stepMap[currentStepNumber];
  }

  return "step-one";
}
