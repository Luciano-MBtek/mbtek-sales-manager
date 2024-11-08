"use server";
import { stepTwoSingleProductSchema } from "@/schemas/singleProductSchema";
import { singleProductRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepTwoFormSingleProductAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
):  Promise<FormErrors | undefined> => {
  const data = Object.fromEntries(formData.entries());

  console.log(data);
  const validated = stepTwoSingleProductSchema.safeParse(data);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(singleProductRoutes.SHIPPING_DATA);
};
