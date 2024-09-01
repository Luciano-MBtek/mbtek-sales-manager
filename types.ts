export type Contact = {
  archived: boolean;
  createdAt: string;
  id: string;
  properties: ContactProperties;
  updatedAt: string;
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
