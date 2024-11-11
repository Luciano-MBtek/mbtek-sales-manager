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
  image?: string;
  selected?: boolean;
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
  firstname: string;
  lastname: string;
  leadStatus: string;
  country_us_ca: string;
  totalProperties: number;
  emptyProperties: number;
  createDate: string;
  lastModifiedDate: string;
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

export enum collectDataRoutes {
  DISCOVERY_CALL = "/forms/discovery-lead/step-one",
  DISCOVERY_CALL_2 = "/forms/discovery-lead/step-two",
  LEAD_QUALIFICATION_B2C = "/forms/discovery-lead/step-three-b2c",
  LEAD_QUALIFICATION_B2B = "/forms/discovery-lead/step-three-b2b",
  LEAD_QUALIFICATION_B2C_2 = "/forms/discovery-lead/step-four",
  REVIEW_LEAD = "/forms/discovery-lead/review",
}

export enum singleProductRoutes {
  SHIPPING_DATA = "/forms/single-product/step-one",
  PRODUCT_DATA = "/forms/single-product/step-two",
  REVIEW_SINGLE_PRODUCT = "/forms/single-product/review",
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
  "B2B (business related)",
  "Not sales related",
];
export const YesOrNo = ["Yes", "No"] as const;

const YesOrNoArray = ["Yes", "No"];

export const leadTypeTuple = leadType as [string, ...string[]];

export const yesOrNoTuple = YesOrNoArray as [string, ...string[]];
