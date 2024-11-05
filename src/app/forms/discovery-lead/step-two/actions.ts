"use server";
import { stepTwoSchema } from "@/schemas/newLeadSchema";
import { collectDataRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepTwoFormAction = (
  prevState: FormErrors | undefined,
  formData: FormData
): FormErrors | undefined => {
  const rawData = Object.fromEntries(formData);

  console.log("RawData:", rawData);

  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const validated = stepTwoSchema.safeParse(data);
  console.log(validated.error);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(collectDataRoutes.LEAD_QUALIFICATION_B2C);
};
