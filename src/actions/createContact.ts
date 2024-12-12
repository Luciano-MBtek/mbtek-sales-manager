"use server";
import { newLeadType } from "@/schemas/newLeadSchema";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

export async function createContact(contact: newLeadType, ownerId: string) {
  const hasNegativeAnswers = [
    contact.decisionMaker,
    contact.goodFitForLead,
    contact.moneyAvailability,
    contact.estimatedTimeForBuying,
  ].includes("No");

  const properties = {
    firstname: contact.name,
    lastname: contact.lastname,
    email: contact.email,
    phone: contact.phone,
    country_us_ca: contact.country,
    state_usa: contact.country === "USA" ? contact.state : "",
    pprovince_territory: contact.country === "Canada" ? contact.province : "",
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
    hubspot_owner_id: ownerId,
    hs_lead_status: hasNegativeAnswers ? "Disqualified" : "OPEN_DEAL",
  };

  console.log(
    JSON.stringify({
      properties,
    })
  );
  try {
    const apiKey = process.env.HUBSPOT_API_KEY;
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();

    const webhookResponse = await fetch(
      "https://api-na1.hubapi.com/automation/v4/webhook-triggers/24467819/iFDAdFK",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId: data.id,
        }),
      }
    );

    if (!webhookResponse.ok) {
      console.error("Error triggering webhook:", await webhookResponse.text());
    }

    revalidatePath("/contacts");

    return {
      success: true,
      contactId: data.id,
      properties: data.properties,
    };
  } catch (error) {
    console.error("Error creating contact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create contact",
    };
  }
}
