"use server";

import { stepOneSchema } from "@/schemas/completeSystemSchema";
import { completeSystemRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepOneFormAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const data: any = Object.fromEntries(formData.entries());

  const unitReplacementTypes = formData.getAll("unit_replacement_type");

  data.unit_replacement_type = unitReplacementTypes;

  // 4. Validate with Zod
  const validated = stepOneSchema.safeParse(data);

  console.log(validated.error);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  // If no errors, redirect or handle success
  redirect(completeSystemRoutes.MARKET_DATA);
};
