import z from "zod";

const HeatElement = z.enum(["fcu", "radiant", "ahu", "Radiator", "Other"]);
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
  buffer: z.instanceof(Buffer).optional(),
});

export const schematicRequestSchema = z.object({
  firstname: z
    .string()
    .min(1, "Please enter lead's firstname.")
    .regex(/^[A-Za-z\s-]+$/, "Firstname should only contain letters"),
  lastname: z
    .string()
    .min(1, "Please enter lead's lastname.")
    .regex(/^[A-Za-z\s-]+$/, "Lastname should only contain letters"),
  email: z.string().email("Please enter a valid email"),
  zip: z
    .string()
    .min(5, "ZIP code must be at least 5 characters")
    .max(10, "ZIP code cannot exceed 10 characters")
    .regex(
      /^(\d{5}(-\d{4})?|[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s\d[ABCEGHJ-NPRSTV-Z]\d)$/,
      "Invalid postal/ZIP code format. Must be USA ZIP (12345 or 12345-6789) or Canadian postal code (A1A 1A1)"
    ),
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
      .nullable()
      .refine((val) => val !== null, {
        message: "Please select a heat element",
      })
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
export const clientFileSchema = z.object({
  name: z.string().min(1, "The file must have a name."),
  type: z.enum(
    ["application/pdf", "image/jpeg", "image/png", "image/svg+xml"],
    {
      errorMap: () => ({ message: "Unsupported file type." }),
    }
  ),
  size: z.number().max(5 * 1024 * 1024, "The file size must be less than 5MB"),
});

export type ClientFileData = z.infer<typeof clientFileSchema>;

export type SchematicData = z.infer<typeof schematicRequestSchema>;
