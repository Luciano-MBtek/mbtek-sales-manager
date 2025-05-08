import {
  StepQualificationOneFormValues,
  StepQualificationTwoFormValues,
  StepQualificationThreeFormValues,
  StepQualificationFourFormValues,
  StepQualificationFiveFormValues,
  ReviewQualificationFormValues,
  disqualifiedLeadFormValues,
} from "@/schemas/leadQualificationSchema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number): string => "$" + value.toFixed(2);

export function getDatePlus30Days(): string {
  const today = new Date();
  const futureDate = new Date(today.setDate(today.getDate() + 30));

  return futureDate.toISOString().split("T")[0];
}

export function getDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export const createContactProperties = (
  contact: StepQualificationOneFormValues,
  ownerId?: string
) => {
  return {
    lead_owner_id: contact.lead_owner_id,
    firstname: contact.name,
    lastname: contact.lastname,
    email: contact.email,
    phone: contact.phone,
    city: contact.city,
    address: contact.address,
    country_us_ca: contact.country,
    state_usa: contact.country === "USA" ? contact.state : "",
    province_territory: contact.country === "Canada" ? contact.province : "",
    lead_type: contact.leadType,
    hs_lead_status: "OPEN_DEAL",
    ...(ownerId && { hubspot_owner_id: ownerId }),
    looking_for: contact.lookingFor,
    hear_about_us: contact.hearAboutUs,
    current_situation: Array.isArray(contact.currentSituation)
      ? contact.currentSituation.length === 1
        ? contact.currentSituation[0]
        : contact.currentSituation.join(";")
      : contact.currentSituation,
  };
};

export const createContactPropertiesStep2 = (
  data: StepQualificationTwoFormValues
) => {
  return {
    building_type: data.building_type,
    project_type: data.project_type,
    current_system_type: data.current_system_type || "",
    system_age: data.system_age || "",
    main_project_goals: Array.isArray(data.main_project_goals)
      ? data.main_project_goals.length === 1
        ? data.main_project_goals[0]
        : data.main_project_goals.join(";")
      : data.main_project_goals,
    competitors_previously_contacted: data.competitors_previously_contacted,
    competitors_name: data.competitors_name || "",
  };
};

export const createContactPropertiesStep3 = (
  data: StepQualificationThreeFormValues
) => {
  return {
    desired_timeframe: data.desired_timeframe,
    decisive_timing_factor: Array.isArray(data.decisive_timing_factor)
      ? data.decisive_timing_factor.length === 1
        ? data.decisive_timing_factor[0]
        : data.decisive_timing_factor.join(";")
      : data.decisive_timing_factor,
    other_timing_factor: data.other_timing_factor || "",
  };
};

export const createContactPropertiesStep4 = (
  data: StepQualificationFourFormValues
) => {
  return {
    decision_making_status: data.decision_making_status,
    property_type: data.property_type,
    type_of_decision: data.type_of_decision,
    additional_comments: data.additional_comments || "",
  };
};

export const createContactPropertiesStep5 = (
  data: StepQualificationFiveFormValues
) => {
  return {
    defined_a_budget: data.defined_a_budget,
    budget_range: data.budget_range,
    aware_of_available_financial_incentives:
      data.aware_of_available_financial_incentives,
    planned_financial_method: data.planned_financial_method,
  };
};

export const createContactPropertiesReview = (
  data: ReviewQualificationFormValues
) => {
  return {
    bant_score: data.bant_score,
  };
};

export const createDisqualifyProperties = (
  data: disqualifiedLeadFormValues
) => {
  return {
    hs_lead_status: data.hs_lead_status,
    disqualification_reason: data.disqualification_reason,
    disqualification_explanation: data.disqualification_explanation,
  };
};
