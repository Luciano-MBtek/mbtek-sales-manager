"use server";

import { stepFiveSchema } from "@/schemas/completeSystemSchema";
import { completeSystemRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepFiveFormAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const data: any = Object.fromEntries(formData.entries());

  const validated = stepFiveSchema.safeParse(data);

  console.log(validated.error);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(completeSystemRoutes.BOOKING_DATA);
};
