"use server";
import { stepOneProductSchema } from "@/schemas/singleProductSchema";
import { singleProductRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepOneFormSingleProductAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const data = Object.fromEntries(formData.entries());
  const validated = stepOneProductSchema.safeParse(data);

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(singleProductRoutes.PRODUCT_DATA);
};
