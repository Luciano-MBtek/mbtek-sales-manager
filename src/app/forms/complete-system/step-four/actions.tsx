"use server";

import { stepFourSchema } from "@/schemas/completeSystemSchema";
import { completeSystemRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepFourFormAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const data: any = Object.fromEntries(formData.entries());

  const validated = stepFourSchema.safeParse(data);

  //parsear el valor No a Noe en interested_to_be_financed

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
  redirect(completeSystemRoutes.SHIPPING_DATA);
};
