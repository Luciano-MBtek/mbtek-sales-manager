"use server";
import { stepFourSchema } from "@/schemas";
import { collectDataRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepFourFormAction = (
  prevState: FormErrors | undefined,
  formData: FormData
): FormErrors | undefined => {
  const rawData = formData;
  console.log("RAW DATA:", rawData);
  const data = Object.fromEntries(formData.entries());

  const validated = stepFourSchema.safeParse(data);
  console.log(validated.error);
  console.log(validated.success);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(collectDataRoutes.REVIEW_LEAD);
};
