export type Contact = {
  archived: boolean;
  createdAt: string;
  id: string;
  properties: ContactProperties;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  unitDiscount: number;
  image?: string;
  selected?: boolean;
  isMain?: boolean;
};

type ContactProperties = {
  createdate: string;
  email: string;
  firstname: string;
  hs_object_id: string;
  lastmodifieddate: string;
  lastname: string;
  phone: string;
};

export type ProgressProperties = {
  id: string;
  firstname: string;
  lastname: string;
  leadStatus: string;
  email: string;
  phone: string;
  state?: string;
  province?: string;
  city: string;
  address: string;
  zip: string;
  country_us_ca: string;
  totalProperties: number;
  emptyProperties: number;
  createDate: string;
  lastModifiedDate: string;
  areDeals: boolean;
  hasSchematic: boolean;
  hasQuotes: boolean;
  // New properties to add
  additional_comments?: string;
  aware_of_available_financial_incentives?: string;
  bant_score?: string;
  budget_range?: string;
  building_type?: string;
  company?: string;
  competitors_name?: string;
  competitors_previously_contacted?: string;
  current_situation?: string;
  current_system_type?: string;
  decision_making_status?: string;
  decisive_timing_factor?: string;
  defined_a_budget?: string;
  desired_timeframe?: string;
  extra_notes?: string;
  hear_about_us?: string;
  heat_elements?: string;
  hs_lead_status?: string;
  hs_object_id?: string;
  hubspot_owner_id?: string;
  lead_owner_id?: string;
  lead_type?: string;
  looking_for?: string;
  main_project_goals?: string;
  number_of_zones?: string;
  other_timing_factor?: string;
  planned_financial_method?: string;
  project_type?: string;
  property_type?: string;
  province_territory?: string;
  schematic_image?: string;
  special_application?: string;
  split_payment?: string;
  square_feet_per_zone?: string;
  state_usa?: string;
  system_age?: string;
  technical_documention_received_from_the_prospect?: string;
  total_area_house?: string;
  type_of_decision?: string;
};

export type PropertyDetail = {
  calculated: boolean;
  dataSensitivity: string;
  description: string;
  displayOrder: number;
  externalOptions: boolean;
  fieldType: string;
  formField: boolean;
  groupName: string;
  hasUniqueValue: boolean;
  hidden: boolean;
  hubspotDefined: boolean;
  label: string;
  modificationMetadata: {
    archivable: boolean;
    readOnlyDefinition: boolean;
    readOnlyValue: boolean;
  };
  name: string;
  options: any[];
  type: string;
};

export interface FormErrors {
  [key: string]: string | undefined;
}

export enum completeSystemRoutes {
  GENERAL_SYSTEM_DATA = "/forms/complete-system/step-one",
  MARKET_DATA = "/forms/complete-system/step-two",
  BUILDING_DATA = "/forms/complete-system/step-three",
  PROJECT_PLANS = "/forms/complete-system/step-four",
  SHIPPING_DATA = "/forms/complete-system/step-five",
  BOOKING_DATA = "/forms/complete-system/step-six",
  REVIEW_COMPLETE_SYSTEM = "/forms/complete-system/review",
}

export enum singleProductRoutes {
  SHIPPING_DATA = "/forms/single-product/step-one",
  PRODUCT_DATA = "/forms/single-product/step-two",
  REVIEW_SINGLE_PRODUCT = "/forms/single-product/review",
}

export enum mainRoutes {
  HOME = "/",
  CONTACTS = "/contacts",
}

export const canadaProvinces = [
  { label: "Alberta", value: "AB" },
  { label: "British Columbia", value: "BC" },
  { label: "Manitoba", value: "MB" },
  { label: "New Brunswick", value: "NB" },
  { label: "Newfoundland and Labrador", value: "NL" },
  { label: "Northwest Territories", value: "NT" },
  { label: "Nova Scotia", value: "NS" },
  { label: "Nunavut", value: "NU" },
  { label: "Ontario", value: "ON" },
  { label: "Prince Edward Island", value: "PE" },
  { label: "Quebec", value: "QC" },
  { label: "Saskatchewan", value: "SK" },
  { label: "Yukon", value: "YT" },
] as const;

export type CanadaProvince = (typeof canadaProvinces)[number]["value"];

export const canadaProvinceValues = canadaProvinces.map((p) => p.value) as [
  string,
  ...string[],
];

export const USStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export const LeadBuyingIntention = [
  "Ready to buy",
  "having a look",
  "no intention",
] as const;

export type USState = (typeof USStates)[number];

export const leadType = [
  "B2C (end user)",
  "Installer (B2B)",
  "Contractor (B2B)",
  "Distributor (B2B)",
];

export const hearAboutUs = [
  { label: "Google Ads", value: "google_ads" },
  { label: "Google Search", value: "google_search" },
  { label: "Facebook Ads", value: "facebook_ads" },
  { label: "Facebook Group", value: "facebook_group" },
  { label: "Friend", value: "friend" },
  { label: "Other", value: "other" },
];

export const currentSituation = [
  { label: "System Failure/urgent", value: "system_failure" },
  { label: "Actively looking for replacement", value: "looking_replacement" },
  { label: "Planned renovation project", value: "renovation_project" },
  { label: "Just seeking information", value: "seeking_information" },
];

export const lookingFor = [
  { label: "Single Products Quote", value: "single_products_quote" },
  { label: "Complete System", value: "complete_system" },
];
export const lookingForTypeValues = lookingFor.map((type) => type.value);

export const YesOrNo = ["Yes", "No"] as const;

const YesOrNoArray = ["Yes", "No"];

export const leadTypeTuple = leadType as [string, ...string[]];

export const yesOrNoTuple = YesOrNoArray as [string, ...string[]];

export interface DocumentationFile {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
}

export interface SchematicRequestData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  zip: string;
  total_area: string;
  number_zones: string;
  square_feet_zone: string;
  heat_elements: string[];
  special_application: string;
  extra_notes: string;
  documentation?: DocumentationFile;
}

export type StringFields =
  | "id"
  | "firstname"
  | "lastname"
  | "email"
  | "zip"
  | "total_area"
  | "number_zones"
  | "square_feet_zone"
  | "special_application"
  | "extra_notes";

export type Rate = {
  costLoaded: number;
  carrierScac: string;
  estimatedDeliveryDate: string;
};

// Step two Types:

export const buildingType = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Industrial", value: "industrial" },
];
export const buildingTypeValues = buildingType.map((type) => type.value);

export const projectType = [
  { label: "New installation in new construction", value: "new_installation" },
  {
    label: "System replacement in existing building",
    value: "system_replacement",
  },
  { label: "System upgrade/extension", value: "system_upgrade_extension" },
  { label: "Maintenance/repair only", value: "maintenance_repair_only" },
];

export const projectTypeValues = projectType.map((type) => type.value);

export const currentSystemType = [
  { label: "Oil Boiler", value: "oil_boiler" },
  { label: "Propane Boiler", value: "propane_boiler" },
  { label: "Electric Boiler", value: "electric_boiler" },
  { label: "Natural Gas Boiler", value: "natural_gas_boiler" },
  { label: "Oil Furnace", value: "oil_furnace" },
  { label: "Natural Gas Furnace", value: "natural_gas_furnace" },
  { label: "Propane Furnace", value: "propane_furnace" },
  { label: "Electric Furnace", value: "electric_furnace" },
  { label: "Electric Baseboards", value: "electric_baseboards" },
  { label: "Mini-splits(A2A)", value: "Mini_splits" },
];

export const currentSystemTypeValues = currentSystemType.map(
  (type) => type.value
);

export const systemAge = [
  { label: "0 to 5 years", value: "0_to_5" },
  { label: "5 to 10 years", value: "5_to_10" },
  { label: "10 to 20 years", value: "10_to_20" },
  { label: "20+ years", value: "20_plus" },
];
export const systemAgeTypeValues = systemAge.map((type) => type.value);

export const mainProjectGoals = [
  { label: "Reduce energy costs", value: "reduce_energy_costs" },
  { label: "Improve comfort", value: "improve_comfort" },
  { label: "Replace failing equipment", value: "replace_failing_equipment" },
  { label: "Add cooling capabilities", value: "add_cooling_capabilities" },
  { label: "Environmental concerns", value: "environmental_concerns" },
];

export const mainProjectGoalsTypeValues = mainProjectGoals.map(
  (type) => type.value
);

// step 3 Types:

export const desiredTimeframe = [
  { label: "Urgent (7 days)", value: "urgent" },
  { label: "Short term (1 month)", value: "short" },
  { label: "Medium term (3 months)", value: "medium" },
  { label: "Long term (6+ months)", value: "long" },
];
export const desiredTimeframeValues = desiredTimeframe.map(
  (type) => type.value
);

export const decisiveTimingFactor = [
  { label: "Current system failure", value: "current_system_failure" },
  { label: "Seasonality (before winter)", value: "seasonality" },
  { label: "Planned global renovation", value: "planned_global_renovation" },
  {
    label: "Availability of financial incentives",
    value: "availability_of_financial_incentives",
  },
  { label: "Stock availability", value: "stock_availability" },
  { label: "Other", value: "other" },
];
export const decisiveTimingFactorValues = decisiveTimingFactor.map(
  (type) => type.value
);

// step 4 values:

export const decisionMakingStatus = [
  { label: "Sole decision maker", value: "sole_decision_maker" },
  { label: "Co-decision maker", value: "co_decision_maker" },
  { label: "Recommender/Prescriber", value: "recommender_prescriber" },
  { label: "Information only", value: "information_only" },
];
export const decisionMakingStatusValues = decisionMakingStatus.map(
  (type) => type.value
);

export const propertyType = [
  { label: "Owner", value: "owner" },
  { label: "Tenant", value: "tenant" },
  {
    label: "Property management company (B2B)",
    value: "property_management_company",
  },
  {
    label: "Corporate facility manager (B2B)",
    value: "corporate_facility_manager",
  },
  { label: "Real state developer (B2B)", value: "real_state_developer" },
];
export const propertyTypeValues = propertyType.map((type) => type.value);

export const typeOfDecision = [
  {
    label: "After consulting multiple quotes",
    value: "consulting_multiple_quotes",
  },
  { label: "Primarily based on price", value: "based_on_price" },
  {
    label: "Based on professional recommendation",
    value: "based_on_pro_recommendation",
  },
  {
    label: "Primarily based on quality/technology",
    value: "based_on_quality_technology",
  },
];

export const typeOfDecisionValues = typeOfDecision.map((type) => type.value);

// step 5

export const budgetRange = [
  { label: "Less than $5000", value: "less_than_5000" },
  { label: "$5000 - $10,000", value: "5000_to_10000" },
  { label: "$10,000 - $20,000", value: "10000_to_20000" },
  { label: "More than $20,000", value: "more_than_20000" },
];

export const budgetRangeValues = budgetRange.map((type) => type.value);

export const plannedFinancialMethod = [
  { label: "Personal Funds", value: "personal_funds" },
  { label: "Bank loan", value: "bank_loan" },
  { label: "Property improvement loan", value: "property_improvement_loan" },
  { label: "Leasing/financing", value: "leasing_financing" },
  { label: "Pending information", value: "pending_information" },
];

export const plannedFinancialMethodValues = plannedFinancialMethod.map(
  (type) => type.value
);

// Disqualified Lead

export const leadStatus = [
  { label: "New", value: "NEW" },
  { label: "In Progress to Qualify", value: "IN_PROGRESS" },
  { label: "In Progress - Discovery Call", value: "OPEN_DISCOVERY" },
  { label: "In Progress - Open Deal", value: "OPEN_DEAL" },
  { label: "Not Sales/CS Related", value: "Not sales related" },
  { label: "Unable to Contact", value: "Unable to Contact" },
  { label: "Disqualified", value: "Disqualified" },
];
export const leadStatusValues = leadStatus.map((type) => type.value);

export const disqualificationReason = [
  { label: "No budget or cannot find the money", value: "no_budget_or_money" },
  { label: "Not a good fit for the lead", value: "not_good_fit" },
  { label: "Not ready to buy in the next 60 days", value: "not_ready_to_buy" },
  { label: "Not talking to the decision maker", value: "not_decision_maker" },
];
export const disqualificationReasonValues = disqualificationReason.map(
  (type) => type.value
);
