"use server";
import { stepTwoSingleProductSchema } from "@/schemas/singleProductSchema";
import { singleProductRoutes, FormErrors } from "@/types";
import { redirect } from "next/navigation";

export const stepTwoFormSingleProductAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const productsData = formData.get("products");
  const products = productsData ? JSON.parse(productsData.toString()) : null;
  const splitPayment = formData.get("splitPayment");

  const data = { products, splitPayment };

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

  redirect(singleProductRoutes.REVIEW_SINGLE_PRODUCT);
};
