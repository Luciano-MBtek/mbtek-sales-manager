import { canadaProvinceValues, USStates } from "@/types";
import z from "zod";

const installationTypes = z.enum(["New Installation", "Retrofit"]);
export const installationTypeValues = installationTypes.options;

const unitReplacementTypes = z.enum([
  "Oil Boiler",
  "Propane (LPG) Boiler",
  "Electric Boiler",
  "Old Wood Boiler",
  "Gas Boiler",
  "Other",
]);
const yesOrNo = z.enum(["Yes", "No"], {
  required_error: "Please select at least an option",
  invalid_type_error: "Please select a valid option",
});

const technologyNeeded = z.enum([
  "Air to water Heat-Pump",
  "Max Heat-pump",
  "Water to water Heat-Pump",
  "UNI Boiler",
  "PELLET Boiler",
  "PRO Boiler",
  "PHOENIX Boiler",
  "HYBRID Boiler",
  "WOODCHIP Boiler",
]);
const unknownTechnology = z.enum([
  "I want air conditioning function for the summer",
  "Domestic hot water (DHW) is part of the system",
  "I will use high temperature baseboard radiators",
  "I want to use wood logs as fuel",
  "I want to use wood logs as fuel for my offgrid building",
  "I want to use wood pellets as fuel",
  "I want to use woodchips as fuel",
  "I want to use coal as fuel",
  "Heat Pump",
  "Boiler",
]);

const prospectValuedBenefits = z.enum([
  "Energy cost savings",
  "Environmental solution",
  "Initial cost",
  "Available grants",
  "Technology",
  "Ease of use",
  "Reliability",
  "Warranty",
  "Other",
]);

const competitors = z.enum([
  "No",
  "Arctic HeatPump",
  "Spacepak",
  "HydroSolar",
  "Other",
]);

const zoneOptions = z.enum([
  "Wall Fan Coil",
  "Ceiling Fan Coil",
  "Floor Fan Coil",
  "Concealed Fan Coil",
  "Air Handling Unit (air duct)",
  "Radiant Floor",
  "Hydronic Baseboard",
]);

const installerOptions = z.enum(
  ["DIY", "I have an installer", "I need an installer"],
  {
    required_error: "Please select an installer option",
    invalid_type_error: "Please select a valid installer option",
  }
);
const interestedFinance = z.enum(["Yes", "No", "Maybe"], {
  required_error: "Please select an interest option",
  invalid_type_error: "Please select a valid interest option",
});

export const unitReplacementTypesValues = unitReplacementTypes.options;
export const yesOrNoValues = yesOrNo.options;
export const technologyNeededValues = technologyNeeded.options;
export const unknownTechnologyValues = unknownTechnology.options;
export const prospectValuedBenefitsValues = prospectValuedBenefits.options;
export const competitorsValues = competitors.options;
export const zoneOptionsValues = zoneOptions.options;
export const installerValues = installerOptions.options;
export const interestedFinanceValues = interestedFinance.options;

const stepOneSchemaBase = z.object({
  installation_type: installationTypes.optional(),
  unit_replacement_type: z.array(unitReplacementTypes).optional(),
  other_replacement_type: z.string().optional(),
  already_have_a_system_in_mind: yesOrNo.optional(),
  technology_needed_main_system: z.string(technologyNeeded).optional(),
  technology_needed: z.string(unknownTechnology).optional(),
});

export const stepOneSchema = stepOneSchemaBase.superRefine((data, ctx) => {
  if (!data.installation_type) {
    ctx.addIssue({
      code: "custom",
      message: "Please select Retrofit or New Installation",
      path: ["installation_type"],
    });
  }

  if (!data.already_have_a_system_in_mind) {
    ctx.addIssue({
      code: "custom",
      message: "Please select Yes or No",
      path: ["already_have_a_system_in_mind"],
    });
  }
  if (data.installation_type === "Retrofit") {
    if (
      !data.unit_replacement_type ||
      data.unit_replacement_type.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Please select at least one replacement type for Retrofit",
        path: ["unit_replacement_type"],
      });
    }

    if (
      data.unit_replacement_type?.includes("Other") &&
      !data.other_replacement_type
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Please specify the 'Other' replacement type",
        path: ["other_replacement_type"],
      });
    }
  }
  if (data.already_have_a_system_in_mind === "Yes") {
    if (!data.technology_needed_main_system) {
      ctx.addIssue({
        code: "custom",
        message: "Please select a specific system",
        path: ["technology_needed_main_system"],
      });
    }
  } else {
    if (!data.technology_needed) {
      ctx.addIssue({
        code: "custom",
        message: "Please select at least one technology statement",
        path: ["technology_needed"],
      });
    }
  }
});

const stepTwoSchemaBase = z.object({
  prospect_valued_benefits: prospectValuedBenefits.optional(),
  other_prospect_valued_benefits: z.string().optional(),
  prior_attempts: yesOrNo.optional(),
  confirmed_prior_attempt: z.string().optional(),
  competitors_previously_contacted: competitors.optional(),
  competitors_feedback: z.string().optional(),
});

export const stepTwoSchema = stepTwoSchemaBase.superRefine((data, ctx) => {
  if (!data.prospect_valued_benefits) {
    ctx.addIssue({
      code: "custom",
      message: "Please select a valued benefit",
      path: ["prospect_valued_benefits"],
    });
  }

  if (
    data.prospect_valued_benefits === "Other" &&
    !data.other_prospect_valued_benefits
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Please specify other valued benefits",
      path: ["other_prospect_valued_benefits"],
    });
  }
  if (!data.prior_attempts) {
    ctx.addIssue({
      code: "custom",
      message: "Please select an option",
      path: ["prior_attempts"],
    });
  }

  if (data.prior_attempts === "Yes") {
    if (!data.confirmed_prior_attempt) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide details about prior attempts",
        path: ["confirmed_prior_attempt"],
      });
    }

    if (!data.competitors_previously_contacted) {
      ctx.addIssue({
        code: "custom",
        message: "Please select competitors previously contacted",
        path: ["competitors_previously_contacted"],
      });
    }

    if (!data.competitors_feedback) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide feedback about competitors",
        path: ["competitors_feedback"],
      });
    }
  }
});

export const zoneDataSchema = z.object({
  zone_name: z.string().min(1, "Zone name is required"),
  sqft: z
    .string()
    .min(1, "Square footage is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num < 27000;
    }, "Square footage must be a number greater than 0 and less than 27,000"),
  selected_option: zoneOptions,
});

const stepThreeSchemaBase = z.object({
  ammount_of_zones: z
    .string()
    .min(1, "Set at least one zone")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 1 && val <= 50, "Amount must be between 1 and 50"),
  buildings_involved_data: z
    .array(zoneDataSchema)
    .min(1, "Add at least one zone"),
});

export const stepThreeSchema = stepThreeSchemaBase.superRefine((data, ctx) => {
  if (data.buildings_involved_data.length !== data.ammount_of_zones) {
    ctx.addIssue({
      code: "custom",
      message: "Please fill in all zone data",
      path: ["buildings_involved_data"],
    });
  }
});

export const stepFourSchema = z.object({
  who_is_the_installer_: installerOptions,
  interested_to_be_financed: interestedFinance,
});

export const stepFiveSchema = z.discriminatedUnion("country", [
  z.object({
    id: z.string().min(1, "Error getting id, refresh page."),
    address: z.string().min(1, "Please enter a street address"),
    city: z.string().min(2, "Please enter a valid city name"),
    zip: z
      .string()
      .regex(
        /^\d{5}(-\d{4})?$/,
        "For USA ZIP code must be 5 digits (12345) or 5 digits with hyphen and 4 digits (12345-6789)"
      ),
    country: z.literal("USA"),
    state: z.enum(USStates, {
      errorMap: () => ({ message: "Please select a valid state" }),
    }),
  }),
  z.object({
    id: z.string().min(1, "Error getting id, refresh page."),
    address: z.string().min(1, "Please enter a street address"),
    city: z.string().min(2, "Please enter a valid city name"),
    zip: z
      .string()
      .length(
        7,
        "Postal code must be 6 characters plus a space (e.g., A1A 1A1)"
      )
      .regex(
        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s\d[ABCEGHJ-NPRSTV-Z]\d$/,
        "Invalid postal code format.For Canada must be like A1A 1A1"
      ),
    country: z.literal("Canada"),
    province: z.enum(canadaProvinceValues, {
      errorMap: () => ({ message: "Please select a valid province" }),
    }),
  }),
]);

export const stepSixSchema = z.object({
  special_requierments: z.string().optional(),
  access_computer: yesOrNo,
});

export const completeSystemSchema = z.discriminatedUnion("country", [
  z.object({
    ...stepOneSchemaBase.shape,
    ...stepTwoSchemaBase.shape,
    ...stepThreeSchemaBase.shape,
    ...stepFourSchema.shape,
    id: z.string().min(1, "Error getting id, refresh page."),
    address: z.string().min(1, "Please enter a street address"),
    city: z.string().min(2, "Please enter a valid city name"),
    zip: z
      .string()
      .regex(
        /^\d{5}(-\d{4})?$/,
        "For USA ZIP code must be 5 digits (12345) or 5 digits with hyphen and 4 digits (12345-6789)"
      ),
    country: z.literal("USA"),
    state: z.enum(USStates, {
      errorMap: () => ({ message: "Please select a valid state" }),
    }),
    ...stepSixSchema.shape,
  }),
  z.object({
    ...stepOneSchemaBase.shape,
    ...stepTwoSchemaBase.shape,
    ...stepThreeSchemaBase.shape,
    ...stepFourSchema.shape,
    id: z.string().min(1, "Error getting id, refresh page."),
    address: z.string().min(1, "Please enter a street address"),
    city: z.string().min(2, "Please enter a valid city name"),
    zip: z
      .string()
      .length(
        7,
        "Postal code must be 6 characters plus a space (e.g., A1A 1A1)"
      )
      .regex(
        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s\d[ABCEGHJ-NPRSTV-Z]\d$/,
        "Invalid postal code format.For Canada must be like A1A 1A1"
      ),
    country: z.literal("Canada"),
    province: z.enum(canadaProvinceValues, {
      errorMap: () => ({ message: "Please select a valid province" }),
    }),
    ...stepSixSchema.shape,
  }),
]);

export type CompleteSystemType = z.infer<typeof completeSystemSchema>;
export type zoneDataType = z.infer<typeof zoneDataSchema>;

export const completeSystemDocumentationSchema = z.array(
  z.object({
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
  })
);

export type CompleteSystemDocumentationData = z.infer<
  typeof completeSystemDocumentationSchema
>;
