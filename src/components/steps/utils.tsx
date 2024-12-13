const schematicProperties = [
  {
    total_area_house: {
      friendlyName: "Total Area of the house/building",
      step: 5,
    },
    number_of_zones: {
      friendlyName: "Ammount of zones in house/building",
      step: 5,
    },
    square_feet_per_zone: {
      friendlyName: "Square feet per zone",
      step: 5,
    },
    heat_elements: {
      friendlyName: "Heat elements",
      step: 5,
    },
    special_application: {
      friendlyName: "Special application - DHW, Pool , None",
      step: 5,
    },
    extra_notes: {
      friendlyName: "Extra notes",
      step: 5,
    },
    technical_documention_received_from_the_prospect: {
      friendlyName: "Technical docs for building schematic",
      step: 5,
    },
    schematic_image: {
      friendlyName: "Technical draw",
      step: 5,
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
    lead_type: {
      friendlyName: "Lead Type",
      step: 1,
    },
    project_summary_user: {
      friendlyName: "Project Summary",
      step: 1,
    },
    reason_for_calling_us: {
      friendlyName: "Reason for Calling us",
      step: 1,
    },
    want_a_complete_system_: {
      friendlyName: "Want a complete system",
      step: 1,
    },
    allocated_budget: {
      friendlyName: "Allocated budget",
      step: 1,
    },
    steps_for_decision: {
      friendlyName: "Steps for Decision",
      step: 1,
    },
    expected_eta: {
      friendlyName: "Expected ETA",
      step: 1,
    },
    decision_maker: {
      friendlyName: "Decision Maker",
      step: 1,
    },
    good_fit_for_lead_: {
      friendlyName: "Are we a good fit for this lead?",
      step: 1,
    },
    money_availability: {
      friendlyName: "Does the lead have or can get the money?",
      step: 1,
    },
    estimated_time_for_buying: {
      friendlyName: "Is the timing right with this lead?",
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
  project_summary_user: {
    friendlyName: "Project Summary",
    step: 3,
  },
  installation_type: {
    friendlyName: "Installation type:",
    step: 3,
  },

  already_have_a_system_in_mind: {
    friendlyName: "Already have a system in mind?",
    step: 3,
  },

  prospect_valued_benefits: {
    friendlyName: "Prospect Valued Benefits",
    step: 3,
  },
  prior_attempts: {
    friendlyName: "Prior Attempts",
    step: 3,
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
  },
  ...schematicProperties[0],
};

export const dateProperties = {
  createdate: { friendlyName: "Create Date", step: 1 },
  lastmodifieddate: { friendlyName: "Last Modified Date", step: 1 },
};
