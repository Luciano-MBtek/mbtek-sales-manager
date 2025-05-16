"use server";
import { getPurchaseOptions } from "@/actions/contact/createDownpayCart";
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

  const purchaseOptions = await getPurchaseOptions();
  // Create URL search params with purchase options data
  const searchParams = new URLSearchParams();

  // Add each purchase option's id and merchantCode to the search params
  if (Array.isArray(purchaseOptions) && purchaseOptions.length > 0) {
    purchaseOptions.forEach((option, index) => {
      // Extract the correct purchase option ID from the nested structure
      const purchaseOptionId =
        option.purchaseOptions && option.purchaseOptions.length > 0
          ? option.purchaseOptions[0].id
          : option.id;

      searchParams.set(`id_${index}`, purchaseOptionId);
      searchParams.set(`merchantCode_${index}`, option.merchantCode);
    });
  }

  // Redirect with the search params
  redirect(`${singleProductRoutes.PRODUCT_DATA}?${searchParams.toString()}`);
};
