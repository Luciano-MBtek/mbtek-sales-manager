import z from "zod";

import {
  USStates,
  canadaProvinceValues,
  leadTypeTuple,
  buildingTypeValues,
  projectTypeValues,
  currentSystemTypeValues,
  systemAgeTypeValues,
  mainProjectGoalsTypeValues,
  yesOrNoTuple,
  desiredTimeframeValues,
  decisiveTimingFactorValues,
  decisionMakingStatusValues,
  propertyTypeValues,
  typeOfDecisionValues,
  budgetRangeValues,
  plannedFinancialMethodValues,
  leadStatusValues,
  disqualificationReasonValues,
} from "@/types";

export const stepOneLeadQualificationSchema = z.discriminatedUnion("country", [
  z.object({
    name: z.string().min(1, "Name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    country: z.literal("USA"),
    state: z.enum(USStates, {
      errorMap: () => ({ message: "Please select a valid state" }),
    }),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    leadType: z.enum(leadTypeTuple, {
      errorMap: () => ({ message: "Please select a valid lead type" }),
    }),
    hearAboutUs: z.string().min(1, "Please select how you heard about us"),
    currentSituation: z
      .array(z.string())
      .min(1, "Please select at least one option"),
    lookingFor: z.string().min(1, "Please select what you are looking for"),
    lead_owner_id: z.string(),
  }),
  z.object({
    name: z.string().min(1, "Name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    country: z.literal("Canada"),
    province: z.enum(canadaProvinceValues, {
      errorMap: () => ({ message: "Please select a valid province" }),
    }),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    leadType: z.enum(leadTypeTuple, {
      errorMap: () => ({ message: "Please select a valid lead type" }),
    }),
    hearAboutUs: z.string().min(1, "Please select how you heard about us"),
    currentSituation: z
      .array(z.string())
      .min(1, "Please select at least one option"),
    lookingFor: z.string().min(1, "Please select what you are looking for"),
    lead_owner_id: z.string(),
  }),
]);

export type StepQualificationOneFormValues = z.infer<
  typeof stepOneLeadQualificationSchema
>;

export const stepTwoQualificationSchema = z
  .object({
    building_type: z.enum(buildingTypeValues as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a valid building type" }),
    }),
    project_type: z.enum(projectTypeValues as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a valid project type" }),
    }),
    current_system_type: z
      .enum(currentSystemTypeValues as [string, ...string[]], {
        errorMap: () => ({ message: "Please select a valid system type" }),
      })
      .optional()
      .nullable(),

    system_age: z
      .enum(systemAgeTypeValues as [string, ...string[]], {
        errorMap: () => ({ message: "Please select the system age" }),
      })
      .optional()
      .nullable(),

    main_project_goals: z
      .array(z.enum(mainProjectGoalsTypeValues as [string, ...string[]]))
      .min(1, "Please select at least one project goal")
      .refine(
        (values) =>
          values.every((val) => mainProjectGoalsTypeValues.includes(val)),
        {
          message: "One or more selected values are not valid project goals",
        }
      ),
    competitors_previously_contacted: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),

    competitors_name: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Si project_type no es new_installation, current_system_type es requerido
    if (data.project_type !== "new_installation" && !data.current_system_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Current system type is required when not installing a new system",
        path: ["current_system_type"],
      });
    }
    if (data.project_type !== "new_installation" && !data.system_age) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "System age is required when not installing a new system",
        path: ["system_age"],
      });
    }
    if (
      data.competitors_previously_contacted === "Yes" &&
      (!data.competitors_name || data.competitors_name.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Competitor name is required when a competitor exists",
        path: ["competitors_name"],
      });
    }
  });

export type StepQualificationTwoFormValues = z.infer<
  typeof stepTwoQualificationSchema
>;

export const stepThreeQualificationSchema = z
  .object({
    desired_timeframe: z.enum(desiredTimeframeValues as [string, ...string[]], {
      errorMap: () => ({ message: "Please select the desired timeframe" }),
    }),
    decisive_timing_factor: z
      .array(z.enum(decisiveTimingFactorValues as [string, ...string[]]))
      .min(1, "Please select at least one timing factor")
      .refine(
        (values) =>
          values.every((val) => decisiveTimingFactorValues.includes(val)),
        {
          message: "One or more selected values are not valid timing factors",
        }
      ),
    other_timing_factor: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Si decisive_timing_factor incluye "other", other_timing_factor es requerido
    if (
      data.decisive_timing_factor.includes("other") &&
      (!data.other_timing_factor || data.other_timing_factor.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify the other timing factor",
        path: ["other_timing_factor"],
      });
    }
  });
export type StepQualificationThreeFormValues = z.infer<
  typeof stepThreeQualificationSchema
>;

///

export const stepFourQualificationSchema = z.object({
  decision_making_status: z.enum(
    decisionMakingStatusValues as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select the decision making status" }),
    }
  ),
  property_type: z.enum(propertyTypeValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select the property type" }),
  }),
  type_of_decision: z.enum(typeOfDecisionValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select the type of decision" }),
  }),
  additional_comments: z.string().optional(),
});

export type StepQualificationFourFormValues = z.infer<
  typeof stepFourQualificationSchema
>;

/// Step 5

export const stepFiveQualificationSchema = z.object({
  defined_a_budget: z.enum(yesOrNoTuple, {
    errorMap: () => ({ message: "Please select Yes or No" }),
  }),
  budget_range: z.enum(budgetRangeValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select the budget range" }),
  }),
  aware_of_available_financial_incentives: z.enum(yesOrNoTuple, {
    errorMap: () => ({ message: "Please select Yes or No" }),
  }),
  planned_financial_method: z.enum(
    plannedFinancialMethodValues as [string, ...string[]],
    {
      errorMap: () => ({
        message: "Please select the planned financial method",
      }),
    }
  ),
});

export type StepQualificationFiveFormValues = z.infer<
  typeof stepFiveQualificationSchema
>;

// review Bant score as JSON

// Add this near your other schemas
const bantScoreSchema = z.object({
  need: z.number(),
  needMax: z.number(),
  authority: z.number(),
  authorityMax: z.number(),
  timing: z.number(),
  timingMax: z.number(),
  budget: z.number(),
  budgetMax: z.number(),
  total: z.number(),
});

// Add this to your existing review schema or create one if it doesn't exist
export const reviewQualificationSchema = z.object({
  bant_score: z.string().refine(
    (str) => {
      try {
        const parsed = JSON.parse(str);
        return bantScoreSchema.safeParse(parsed).success;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid BANT score format",
    }
  ),
});

export type ReviewQualificationFormValues = z.infer<
  typeof reviewQualificationSchema
>;

export const disqualifiedLeadSchema = z.object({
  hs_lead_status: z.enum(leadStatusValues as [string, ...string[]], {
    errorMap: () => ({ message: "Please select the lead status" }),
  }),
  disqualification_reason: z.enum(
    disqualificationReasonValues as [string, ...string[]],
    {
      errorMap: () => ({
        message: "Please select the disqualification reason",
      }),
    }
  ),
  disqualification_explanation: z
    .string()
    .max(400, { message: "Explanation must be 400 characters or less" })
    .optional(),
});
export type disqualifiedLeadFormValues = z.infer<typeof disqualifiedLeadSchema>;
