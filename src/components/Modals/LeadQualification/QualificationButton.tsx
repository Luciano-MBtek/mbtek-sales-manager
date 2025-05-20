// src/components/QualificationButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QualificationModal } from "@/components/Modals/LeadQualification/QualificationModal";
import { LeadProps } from "@/components/LeadsQualifier/LeadQualificationContent";
import {
  QualificationData,
  QualificationStep,
  useQualificationStore,
} from "@/store/qualification-store";
import { getCurrentQualificationStep } from "@/components/LeadsQualifier/leadQualificationProgress";

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
    // If there's lead data, prepare the qualification store
    if (lead) {
      // Reset data first to ensure we have a clean state
      resetData();

      // Map lead properties to QualificationData format
      const leadData = mapLeadToQualificationData(lead);

      // Update the store with lead data
      updateData(leadData);

      // Set the appropriate step based on progress
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

// Helper function to map lead properties to qualification data format
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

    // If it's a JSON string, try to parse it
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch (e) {
      // If not JSON, it might be semicolon-separated
      return value.includes(";") ? value.split(";") : [value];
    }
  };

  return {
    contactId: lead.id,
    name: props.firstname || "",
    lastname: props.lastname || "",
    email: props.email || "",
    phone: props.phone || "",
    country: props.country_us_ca || "USA",
    state: props.state_usa || "Alabama",
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
  };
}

// Helper function to determine starting step based on progress
function determineStartingStep(
  properties: Record<string, any>
): QualificationStep {
  // If we have a BANT score, start at review
  if (properties.bant_score) {
    return "review";
  }

  // Map the step number to the corresponding step type
  const stepMap: Record<number, QualificationStep> = {
    1: "step-one",
    2: "step-two",
    3: "step-three",
    4: "step-four",
    5: "step-five",
    6: "review",
  };

  const currentStepNumber = getCurrentQualificationStep(properties);

  // If the step is completed, move to the next step, otherwise stay on the current step
  if (currentStepNumber >= 1 && currentStepNumber <= 6) {
    return stepMap[currentStepNumber];
  }

  // Default to step one
  return "step-one";
}
