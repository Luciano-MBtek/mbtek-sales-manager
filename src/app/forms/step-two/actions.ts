"use server";
import { stepTwoSchema } from "@/schemas";
import { collectDataRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepTwoFormAction = (
  prevState: FormErrors | undefined,
  formData: FormData
): FormErrors | undefined => {
  const data = Object.fromEntries(formData.entries());

  console.log(data);

  const validated = stepTwoSchema.safeParse(data);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }
  console.log(collectDataRoutes.LEAD_QUALIFICATION_B2C);
  redirect(collectDataRoutes.LEAD_QUALIFICATION_B2C);
};
