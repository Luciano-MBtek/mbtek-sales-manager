const schematicProperties = [
  {
    total_area_house: {
      friendlyName: "Total Area of the house/building",
      step: 3,
    },
    number_of_zones: {
      friendlyName: "Ammount of zones in house/building",
      step: 3,
    },
    square_feet_per_zone: {
      friendlyName: "Square feet per zone",
      step: 3,
    },
    heat_elements: {
      friendlyName: "Heat elements",
      step: 3,
    },
    special_application: {
      friendlyName: "Special application - DHW, Pool , None",
      step: 3,
    },
    extra_notes: {
      friendlyName: "Extra notes",
      step: 3,
    },
    technical_documention_received_from_the_prospect: {
      friendlyName: "Technical docs for building schematic",
      step: 3,
    },
    schematic_image: {
      friendlyName: "Technical draw",
      step: 3,
    },
  },
];

const leadQualificationProperties = [
  {
    hs_object_id: {
      friendlyName: "Record ID",
      step: 1,
    },
    country_us_ca: {
      friendlyName: "Country",
      step: 1,
    },
    state_usa: {
      friendlyName: "State",
      step: 1,
    },
    province_territory: {
      friendlyName: "Province",
      step: 1,
    },
    email: {
      friendlyName: "Email",
      step: 1,
    },
    firstname: {
      friendlyName: "Name",
      step: 1,
    },
    lastname: {
      friendlyName: "Last Name",
      step: 1,
    },
    phone: {
      friendlyName: "Phone",
      step: 1,
    },
    city: {
      friendlyName: "City",
      step: 1,
    },
    address: {
      friendlyName: "Address",
      step: 1,
    },
    lead_type: {
      friendlyName: "Lead Type",
      step: 1,
    },
    lead_owner_id: {
      friendlyName: "Lead Owner ID",
      step: 1,
    },
    hear_about_us: {
      friendlyName: "How you heard about us",
      step: 1,
    },
    current_situation: {
      friendlyName: "Current Situation",
      step: 1,
    },
    looking_for: {
      friendlyName: "What you are looking for",
      step: 1,
    },
    building_type: {
      friendlyName: "Building Type",
      step: 1,
    },
    project_type: {
      friendlyName: "Project Type",
      step: 1,
    },
    current_system_type: {
      friendlyName: "Current System Type",
      step: 1,
    },
    system_age: {
      friendlyName: "System Age",
      step: 1,
    },
    main_project_goals: {
      friendlyName: "Main Project Goals",
      step: 1,
    },
    competitors_previously_contacted: {
      friendlyName: "Competitors Previously Contacted",
      step: 1,
    },
    competitors_name: {
      friendlyName: "Competitors Name",
      step: 1,
    },
    desired_timeframe: {
      friendlyName: "Desired Timeframe",
      step: 1,
    },
    decisive_timing_factor: {
      friendlyName: "Decisive Timing Factor",
      step: 1,
    },
    other_timing_factor: {
      friendlyName: "Other Timing Factor",
      step: 1,
    },
    decision_making_status: {
      friendlyName: "Decision Making Status",
      step: 1,
    },
    property_type: {
      friendlyName: "Property Type",
      step: 1,
    },
    type_of_decision: {
      friendlyName: "Type of Decision",
      step: 1,
    },
    additional_comments: {
      friendlyName: "Additional Comments",
      step: 1,
    },
    defined_a_budget: {
      friendlyName: "Defined a Budget",
      step: 1,
    },
    budget_range: {
      friendlyName: "Budget Range",
      step: 1,
    },
    aware_of_available_financial_incentives: {
      friendlyName: "Aware of Financial Incentives",
      step: 1,
    },
    planned_financial_method: {
      friendlyName: "Planned Financial Method",
      step: 1,
    },
    bant_score: {
      friendlyName: "BANT Score",
      step: 1,
    },
    hs_lead_status: {
      friendlyName: "Lead Status",
      step: 1,
    },
    hubspot_owner_id: {
      friendlyName: "Hubspot Owner ID",
      step: 1,
    },
    company: {
      friendlyName: "Company",
      step: 1,
    },
  },
];

const shippingData = [
  {
    address: {
      friendlyName: "Street address",
      step: 2,
    },
    city: {
      friendlyName: "City",
      step: 2,
    },
    zip: {
      friendlyName: "zip/postal code",
      step: 2,
    },
    split_payment: {
      friendlyName: "Require split payment?",
      step: 2,
    },
  },
];

export const propertyNameMap: Record<
  string,
  { friendlyName: string; step: number }
> = {
  ...leadQualificationProperties[0],
  ...shippingData[0],
  /* installation_type: {
    friendlyName: "Installation type:",
    step: 4,
  },

  already_have_a_system_in_mind: {
    friendlyName: "Already have a system in mind?",
    step: 4,
  },

  prospect_valued_benefits: {
    friendlyName: "Prospect Valued Benefits",
    step: 4,
  },
  prior_attempts: {
    friendlyName: "Prior Attempts",
    step: 4,
  },
  ammount_of_zones: {
    friendlyName: "Ammount of zones connected to the system",
    step: 4,
  },
  buildings_involved_data: {
    friendlyName: "Buildings involved data",
    step: 4,
  },
  who_is_the_installer_: {
    friendlyName: "Who is the installer?",
    step: 4,
  },
  interested_to_be_financed: {
    friendlyName: "Interested to be financed",
    step: 4,
  },
  special_requierments: {
    friendlyName: "Special requierments",
    step: 4,
  },
  access_computer: {
    friendlyName: "Access computer",
    step: 4,
  }, */
  ...schematicProperties[0],
};

export const dateProperties = {
  createdate: { friendlyName: "Create Date", step: 1 },
  lastmodifieddate: { friendlyName: "Last Modified Date", step: 1 },
};
