import z from "zod";

const HeatElement = z.enum(["FCU", "Radiant", "AHU", "Radiator", "Other"]);
export const heatElementValues = HeatElement.options;

export const SpecialApplication = ["DHW", "Pool", "None"] as const;
export const specialApplicationValues = SpecialApplication.map((app) => ({
  label: app,
  value: app,
}));

const fileSchema = z.object({
  name: z.string().min(1, "El archivo debe tener un nombre."),
  type: z.enum(
    ["application/pdf", "image/jpeg", "image/png", "image/svg+xml"],
    {
      errorMap: () => ({ message: "Tipo de archivo no soportado." }),
    }
  ),
  size: z
    .number()
    .max(5 * 1024 * 1024, "El tamaño del archivo debe ser menor a 5MB"),
  buffer: z.instanceof(Buffer),
});

export const schematicRequestSchema = z.object({
  firstname: z.string().min(1, "Please enter lead's firstname."),
  lastname: z.string().min(1, "Please enter lead's lastname."),
  email: z.string().email("Please enter a valid email"),
  zip: z
    .string()
    .min(5, "ZIP code must be at least 5 characters")
    .max(10, "ZIP code cannot exceed 10 characters")
    .regex(/^[0-9-]+$/, "ZIP code can only contain numbers and hyphens"),
  total_area: z
    .string()
    .min(1, "Please enter an approximately area of the house/building."),
  number_zones: z.string().min(1, "Please enter at least one zone."),
  square_feet_zone: z.string().optional(),
  heat_elements: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z
      .array(HeatElement)
      .min(1, "Please select at least one heat element")
      .nonempty("Please select at least one heat element")
  ),
  special_application: z.enum(SpecialApplication, {
    errorMap: () => ({ message: "Please select a valid special application." }),
  }),
  documentation: fileSchema.optional(),
  extra_notes: z
    .string()
    .max(300, "Please enter no more than 300 characters")
    .optional(),
});
