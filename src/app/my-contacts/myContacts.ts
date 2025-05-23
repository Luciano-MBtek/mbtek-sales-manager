export interface OwnedContacts {
  id: string;
  properties: {
    createdate: string;
    email: string;
    firstname: string;
    lastname: string;
    lastmodifieddate: string;
    address: string;
    phone: string;
    company: string | null;
    lead_type: string;
    total_revenue: string;
    access_computer: string | null;
    allocated_budget: string | null;
    already_have_a_system_in_mind: string | null;
    ammount_of_zones: string | null;
    buildings_involved_data: string | null;
    city: string;
    country_us_ca: string | null;
    estimated_time_for_buying: string | null;
    expected_eta: string | null;
    extra_notes: string | null;
    good_fit_for_lead_: string | null;
    heat_elements: string | null;
    hs_lead_status: string | null;
    hs_object_id: string;
    hubspot_owner_id: string;
    installation_type: string | null;
    interested_to_be_financed: string | null;
    money_availability: string | null;
    number_of_zones: string | null;
    prior_attempts: string | null;
    project_summary_user: string | null;
    prospect_valued_benefits: string | null;
    province_territory: string | null;
    reason_for_calling_us: string | null;
    schematic_image: string | null;
    special_application: string | null;
    special_requierments: string | null;
    split_payment: string | null;
    square_feet_per_zone: string | null;
    state_usa: string | null;
    technical_documention_received_from_the_prospect: string | null;
    total_area_house: string | null;
    want_a_complete_system_: string | null;
    who_is_the_installer_: string | null;
    zip: string;
  };
}
