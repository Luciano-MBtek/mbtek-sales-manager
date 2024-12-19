"use server";
import { stepThreeSchemaB2C } from "@/schemas/newLeadSchema";
import { collectDataRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepThreeFormAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const data = Object.fromEntries(formData.entries());

  const validated = stepThreeSchemaB2C.safeParse(data);

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(collectDataRoutes.LEAD_QUALIFICATION_B2C_2);
};
