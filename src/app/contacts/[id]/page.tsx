import { GetContactById } from "@/actions/getContactById";
import ContactStepProgress from "@/components/ContactStepProgress";
import { ProgressProperties } from "@/types";
import { getOwnerById } from "@/actions/getOwnerById";
import ContactOwnerCard from "@/components/ContactOwnerCard";
import ContactSummary from "@/components/ContactSummary";
import { getTicketsFromContacts } from "@/actions/getTicketsFromContact";
import OpenTicketsCard from "@/components/Ticket/OpenTicketsCard";

type Props = {
  params: Promise<{ id: string }>;
};

const ContactFullData = async (props: Props) => {
  const params = await props.params;

  const { id } = params;

  const contact = await GetContactById(id);

  const tickets = await getTicketsFromContacts(id);

  const contactOwner = await getOwnerById(
    contact.properties.hubspot_owner_id,
    id
  );

  const hasSchematicRequest = Boolean(
    contact.properties.total_area_house && contact.properties.number_of_zones
  );

  const contactSummary = contact.properties.project_summary_user;

  const progressProperties: ProgressProperties = {
    id: id,
    firstname: contact.properties.firstname || "N/A",
    lastname: contact.properties.lastname || "N/A",
    leadStatus: contact.properties.hs_lead_status || "N/A",
    email: contact.properties.email || "N/A",
    address: contact.properties.address || "N/A",
    country_us_ca: contact.properties.country_us_ca || "N/A",
    phone: contact.properties.phone || "N/A",
    totalProperties: Object.keys(contact.properties).length,
    emptyProperties: Object.values(contact.properties).filter(
      (value) => value === null || value === ""
    ).length,
    createDate: contact.properties.createdate || "N/A",
    lastModifiedDate: contact.properties.lastmodifieddate || "N/A",
    state: contact.properties.state_usa,
    province: contact.properties.province_territory,
    city: contact.properties.city || "N/A",
    zip: contact.properties.zip || "N/A",

    hasSchematic: hasSchematicRequest,

    // New properties
    additional_comments: contact.properties.additional_comments,
    aware_of_available_financial_incentives:
      contact.properties.aware_of_available_financial_incentives,
    bant_score: contact.properties.bant_score,
    budget_range: contact.properties.budget_range,
    building_type: contact.properties.building_type,
    company: contact.properties.company,
    competitors_name: contact.properties.competitors_name,
    competitors_previously_contacted:
      contact.properties.competitors_previously_contacted,
    current_situation: contact.properties.current_situation,
    current_system_type: contact.properties.current_system_type,
    decision_making_status: contact.properties.decision_making_status,
    decisive_timing_factor: contact.properties.decisive_timing_factor,
    defined_a_budget: contact.properties.defined_a_budget,
    desired_timeframe: contact.properties.desired_timeframe,
    extra_notes: contact.properties.extra_notes,
    hear_about_us: contact.properties.hear_about_us,
    heat_elements: contact.properties.heat_elements,
    hs_lead_status: contact.properties.hs_lead_status,
    hs_object_id: contact.properties.hs_object_id,
    hubspot_owner_id: contact.properties.hubspot_owner_id,
    lead_owner_id: contact.properties.lead_owner_id,
    lead_type: contact.properties.lead_type,
    looking_for: contact.properties.looking_for,
    main_project_goals: contact.properties.main_project_goals,
    number_of_zones: contact.properties.number_of_zones,
    other_timing_factor: contact.properties.other_timing_factor,
    planned_financial_method: contact.properties.planned_financial_method,
    project_type: contact.properties.project_type,
    property_type: contact.properties.property_type,
    province_territory: contact.properties.province_territory,
    schematic_image: contact.properties.schematic_image,
    special_application: contact.properties.special_application,
    split_payment: contact.properties.split_payment,
    square_feet_per_zone: contact.properties.square_feet_per_zone,
    state_usa: contact.properties.state_usa,
    system_age: contact.properties.system_age,
    technical_documention_received_from_the_prospect:
      contact.properties.technical_documention_received_from_the_prospect,
    total_area_house: contact.properties.total_area_house,
    type_of_decision: contact.properties.type_of_decision,
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 mt-[--header-height]">
      <ContactOwnerCard
        owner={
          contactOwner && contactOwner.id
            ? {
                id: contactOwner.id,
                email: contactOwner.email,
                firstName: contactOwner.firstName,
                lastName: contactOwner.lastName,
              }
            : null
        }
      />
      {tickets.length > 0 && (
        <div className="flex w-full items-center justify-between">
          <OpenTicketsCard tickets={tickets} />
        </div>
      )}
      <div className="flex flex-col w-full items-center justify-between">
        <ContactStepProgress properties={progressProperties} />
      </div>
      {contactSummary && (
        <div>
          <ContactSummary contactSummary={contactSummary} />
        </div>
      )}
    </div>
  );
};

export default ContactFullData;
