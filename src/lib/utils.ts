import {
  StepQualificationOneFormValues,
  StepQualificationTwoFormValues,
  StepQualificationThreeFormValues,
  StepQualificationFourFormValues,
  StepQualificationFiveFormValues,
  StepSixQualificationFormValues,
  disqualifiedLeadFormValues,
  StepSevenQualificationFormValues,
} from "@/schemas/leadQualificationSchema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatCurrency = (value: number): string => "$" + value.toFixed(2);

export function getDatePlus30Days(): string {
  const today = new Date();
  const futureDate = new Date(today.setDate(today.getDate() + 30));

  return futureDate.toISOString().split("T")[0];
}
export function getDatePlus7Days(): string {
  const today = new Date();
  const futureDate = new Date(today.setDate(today.getDate() + 7));

  return futureDate.toISOString().split("T")[0];
}

export function getDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function getCurrentWeekDateRange(): {
  startDate: string;
  endDate: string;
} {
  // Get current week's start and end dates
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday

  const startDate = new Date(now);
  startDate.setDate(now.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // If Sunday, go back to previous Monday
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  // Format dates to ISO strings
  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();

  return { startDate: startDateISO, endDate: endDateISO };
}

export function getCurrentDayDateRange() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    startDate: yesterday.toISOString(),
    endDate: now.toISOString(),
  };
}

export function getCurrentMonthDateRange(): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();

  // Date from 30 days ago
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 30);
  startDate.setHours(0, 0, 0, 0);

  // Current date as end date
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  // Format dates to ISO strings
  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();

  return { startDate: startDateISO, endDate: endDateISO };
}

export function getAllTimeDateRange(): {
  startDate: string;
  endDate: string;
} {
  // Use a very old date for start date (e.g., 10 years ago)
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 10);
  startDate.setHours(0, 0, 0, 0);

  // Current date as end date
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  // Format dates to ISO strings
  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();

  return { startDate: startDateISO, endDate: endDateISO };
}

export function getDateRangeByType(type: string): {
  startDate: string;
  endDate: string;
} {
  switch (type) {
    case "weekly":
      return getCurrentWeekDateRange();
    case "monthly":
      return getCurrentMonthDateRange();
    case "allTime":
      return getAllTimeDateRange();
    default:
      return getCurrentWeekDateRange();
  }
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
    zip: contact.zipCode,
    zip_postal_code: contact.zipCode,
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

export const createContactPropertiesStep6 = (
  data: StepSixQualificationFormValues
) => {
  return {
    bant_score: data.bant_score,
  };
};
export const createContactPropertiesStep7 = (
  data: StepSevenQualificationFormValues
) => {
  return {
    shipping_address: data.shipping_address,
    shipping_city: data.shipping_city,
    shipping_state: data.shipping_state,
    shipping_province: data.shipping_province,
    shipping_zip_code: data.shipping_zip_code,
    shipping_country: data.shipping_country,
    shipping_notes: data.shipping_notes,
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

export function formatDateWithDay(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  // Check if it's yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Get day name
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[date.getDay()];

  // Get day number
  const dayNumber = date.getDate();

  return `${dayName} ${dayNumber}`;
}

export function calculatePercentageChange(
  current: number,
  previous: number
): {
  percentageChange: number;
  formattedPercentage: string;
} {
  let percentageChange = 0;

  if (previous > 0) {
    percentageChange = ((current - previous) / previous) * 100;
  } else if (current > 0) {
    percentageChange = 100; // If previous was 0 and now we have values, it's a 100% increase
  }

  const formattedPercentage = percentageChange.toFixed(1);

  return { percentageChange, formattedPercentage };
}
