// src/types/zoneTypes.ts
export interface Zone {
  name: string;
  size: string;
  distribution: string;
}

export interface ZonesInformationFormValues {
  numberOfZones: string;
  zones: Zone[];
}

export interface ZonesUpdateData {
  number_of_zones: string;
  zones_configuration: string;
  last_step?: string;
}

export function convertFormToUpdateData(
  data: ZonesInformationFormValues,
  nextStep?: string
): ZonesUpdateData {
  return {
    number_of_zones: data.numberOfZones,
    zones_configuration: JSON.stringify(data.zones),
    ...(nextStep ? { last_step: nextStep } : {}),
  };
}
