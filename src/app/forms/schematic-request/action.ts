"use server";
import { schematicRequestSchema } from "@/schemas/schematicRequestSchema";
import { FormErrors, mainRoutes } from "@/types";
import { redirect } from "next/navigation";

export const uploadFile = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  // Convertir FormData a un objeto
  const textFields = [
    "firstname",
    "lastname",
    "email",
    "zip",
    "total_area",
    "number_zones",
    "square_feet_zone",
    "heat_elements",
    "special_application",
    "extra_notes",
  ];
  const data: any = {};
  for (const field of textFields) {
    const value = formData.get(field);
    data[field] = value;
  }

  // Manejar heat_elements (puede ser string o array)
  if (typeof data.heat_elements === "string") {
    data.heat_elements = [data.heat_elements];
  }

  // Extraer y procesar el archivo
  const file = formData.get("documentation") as File | null;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    data.documentation = {
      name: file.name,
      type: file.type,
      size: file.size,
      buffer: buffer,
    };
  } else {
    data.documentation = undefined; // O manejar según tus necesidades
  }

  console.log("Processed Data:", data);
  const validated = schematicRequestSchema.safeParse(data);
  console.log("Validation:", validated.error);
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
