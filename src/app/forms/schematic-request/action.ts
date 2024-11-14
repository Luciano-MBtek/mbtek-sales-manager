"use server";
import { schematicRequestSchema } from "@/schemas/schematicRequestSchema";
import { FormErrors, mainRoutes } from "@/types";
import { redirect } from "next/navigation";

export const uploadFile = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  // Convertir FormData a un objeto
  const data = Object.fromEntries(formData.entries());

  console.log("Raw Data:", data);
  const validated = schematicRequestSchema.safeParse(data);
  console.log("Validation:", validated);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    return errors;
  }

  redirect(mainRoutes.CONTACTS);
};
