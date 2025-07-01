export interface BuildingNeedsFormValues {
  yearOfConstruction: number;
  insulationType: string;
  specificNeeds: string[];
  otherSpecificNeed?: string;
  isOtherSelected: boolean;
  installationResponsible: string;
}

export interface BuildingNeedsUpdateData {
  year_of_construction: number;
  insulation_type: string;
  specific_needs: string;
  other_specific_need: string;
  installation_responsible: string;
  last_step?: string;
}

export function convertBuildingFormToUpdateData(
  data: BuildingNeedsFormValues,
  nextStep?: string
): BuildingNeedsUpdateData {
  return {
    year_of_construction: Number(data.yearOfConstruction),
    insulation_type: data.insulationType,
    specific_needs: data.specificNeeds.join(";"),
    other_specific_need: data.otherSpecificNeed || "",
    installation_responsible: data.installationResponsible,
    ...(nextStep ? { last_step: nextStep } : {}),
  };
}
