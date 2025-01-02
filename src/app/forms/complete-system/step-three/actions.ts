"use server";

import { stepThreeSchema } from "@/schemas/completeSystemSchema";
import { completeSystemRoutes } from "@/types";
import { redirect } from "next/navigation";

export interface FormErrors {
  [key: string]:
    | string
    | Array<{
        zone_name?: string;
        sqft?: string;
        selected_option?: string;
      }>
    | undefined;
}

export const stepThreeFormAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const rawData: any = Object.fromEntries(formData.entries());

  const zonesCount = parseInt(rawData.ammount_of_zones as string);
  const buildings_involved_data = [];

  for (let i = 0; i < zonesCount; i++) {
    buildings_involved_data.push({
      zone_name: rawData[`zone_${i}`] as string,
      sqft: rawData[`sqft_${i}`] as string,
      selected_option: rawData[`selected_option_${i}`] as string,
    });
  }

  const transformedData = {
    ammount_of_zones: rawData.ammount_of_zones,
    buildings_involved_data,
  };

  console.log("Transformed data:", transformedData);

  const validated = stepThreeSchema.safeParse(transformedData);

  console.log(validated.error);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      // Check if the path includes buildings_involved_data
      if (issue.path[0] === "buildings_involved_data") {
        const index = issue.path[1] as number; // Get the array index
        const field = issue.path[2] as string; // Get the field name (zone_name, sqft, etc.)

        if (!acc.buildings_involved_data) {
          acc.buildings_involved_data = [];
        }

        if (!acc.buildings_involved_data[index]) {
          (
            acc.buildings_involved_data as Array<{
              zone_name?: string;
              sqft?: string;
              selected_option?: string;
            }>
          )[index] = {};
        }

        (acc.buildings_involved_data[index] as any)[field] = issue.message;
      } else {
        // Handle other top-level errors
        const path = issue.path[0] as string;
        acc[path] = issue.message;
      }
      return acc;
    }, {});
    return errors;
  }

  // If no errors, redirect or handle success
  redirect(completeSystemRoutes.PROJECT_PLANS);
};
