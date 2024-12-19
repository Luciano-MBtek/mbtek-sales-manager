import { newLeadType } from "@/schemas/newLeadSchema";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  contact: newLeadType,
  ownerId?: string
) => {
  const hasNegativeAnswers = [
    contact.decisionMaker,
    contact.goodFitForLead,
    contact.moneyAvailability,
    contact.estimatedTimeForBuying,
  ].includes("No");
  return {
    firstname: contact.name,
    lastname: contact.lastname,
    email: contact.email,
    phone: contact.phone,
    country_us_ca: contact.country,
    state_usa: contact.country === "USA" ? contact.state : "",
    province_territory: contact.country === "Canada" ? contact.province : "",
    lead_type: contact.leadType,
    project_summary_user: contact.projectSummary,
    reason_for_calling_us: contact.reasonForCalling,
    want_a_complete_system_: contact.wantCompleteSystem,
    allocated_budget: contact.allocatedBudget,
    lead_buying_intention: contact.leadBuyingIntention,
    expected_eta: format(contact.expectedETA, "yyyy-MM-dd"),
    is_contact_the_decision_maker_: contact.decisionMaker,
    good_fit_for_lead_: contact.goodFitForLead,
    money_availability: contact.moneyAvailability,
    estimated_time_for_buying: contact.estimatedTimeForBuying,
    hs_lead_status: hasNegativeAnswers ? "Disqualified" : "OPEN_DEAL",
    ...(ownerId && { hubspot_owner_id: ownerId }),
  };
};
