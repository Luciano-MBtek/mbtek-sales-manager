import z from "zod";
import {
  USStates,
  canadaProvinceValues,
  leadType,
  LeadBuyingIntention,
} from "./types";

const YesOrNo = ["Yes", "No"];

const leadTypeTuple = leadType as [string, ...string[]];

const yesOrNoTuple = YesOrNo as [string, ...string[]];

export const stepOneSchema = z.object({
  name: z.string().min(1, "Please enter lead's name."),
  lastname: z.string().min(1, "Please enter lead's lastname."),
  email: z.string().email("Please enter a valid email"),
});

const phoneSchema = z
  .string()
  .regex(
    /^\d{10}$/,
    "Please enter a valid 10-digit phone number (e.g., 6163354521)"
  );

export const stepTwoSchema = z.discriminatedUnion("country", [
  z.object({
    phone: phoneSchema,
    country: z.literal("USA"),
    state: z.enum(USStates, {
      errorMap: () => ({ message: "Please select a valid state" }),
    }),
    leadType: z.enum(leadTypeTuple, {
      errorMap: () => ({ message: "Please select a valid lead type" }),
    }),
  }),
  z.object({
    phone: phoneSchema,
    country: z.literal("Canada"),
    province: z.enum(canadaProvinceValues, {
      errorMap: () => ({ message: "Please select a valid province" }),
    }),
    leadType: z.enum(leadTypeTuple, {
      errorMap: () => ({ message: "Please select a valid lead type" }),
    }),
  }),
]);

export const stepThreeBaseSchema = z.object({
  projectSummary: z
    .string()
    .min(5, "Please enter at least 5 characters")
    .max(300, "Please enter no more than 300 characters"),
  reasonForCalling: z
    .string()
    .min(3, "Please enter at least 3 characters")
    .max(300, "Please enter no more than 300 characters"),
  wantCompleteSystem: z.enum(yesOrNoTuple, {
    errorMap: () => ({ message: "Please select Yes or No" }),
  }),
  allocatedBudget: z.string().optional(),
  stepsForDecision: z.string().optional(),
  expectedETA: z.string().optional(),
});

export const stepThreeSchemaB2C = stepThreeBaseSchema.superRefine(
  (data, ctx) => {
    if (data.wantCompleteSystem === "Yes") {
      if (!data.allocatedBudget) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Allocated Budget is required when wanting a complete system.",
          path: ["allocatedBudget"],
        });
      }
      if (!data.stepsForDecision) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Steps for making a decision are required when wanting a complete system.",
          path: ["stepsForDecision"],
        });
      }
    }
  }
);

export const stepThreeSchema = z.object({
  contactName: z
    .string()
    .min(5, "Please enter a contact name of at least 5 characters long"),
  contactEmail: z.string().email("Please enter a valid email"),
});

export const stepFourSchema = z.object({
  leadBuyingIntention: z.enum(LeadBuyingIntention, {
    errorMap: () => ({ message: "Please select a valid intention" }),
  }),
  expectedETA: z
    .string()
    .min(1, "Expected ETA is required.")
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "You must choose a date. If there's no date, pick the current date."),
});

export const newLeadSchema = z
  .discriminatedUnion("country", [
    z.object({
      ...stepOneSchema.shape,
      phone: phoneSchema,
      country: z.literal("USA"),
      state: z.enum(USStates, {
        errorMap: () => ({ message: "Please select a valid state" }),
      }),
      leadType: z.enum(leadTypeTuple, {
        errorMap: () => ({ message: "Please select a valid lead type" }),
      }),
      ...stepThreeBaseSchema.shape,
      ...stepFourSchema.shape,
    }),
    z.object({
      ...stepOneSchema.shape,
      phone: phoneSchema,
      country: z.literal("Canada"),
      province: z.enum(canadaProvinceValues, {
        errorMap: () => ({ message: "Please select a valid province" }),
      }),
      leadType: z.enum(leadTypeTuple, {
        errorMap: () => ({ message: "Please select a valid lead type" }),
      }),
      ...stepThreeBaseSchema.shape,
      ...stepFourSchema.shape,
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.wantCompleteSystem === "Yes") {
      if (!data.allocatedBudget) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Allocated Budget is required when wanting a complete system.",
          path: ["allocatedBudget"],
        });
      }
      if (!data.stepsForDecision) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Steps for making a decision are required when wanting a complete system.",
          path: ["stepsForDecision"],
        });
      }
    }
  });

export const newLeadInitialValuesSchema = z.object({
  name: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  province: z.string().optional(),
  leadType: z.union([z.string(), z.array(z.string())]).optional(),
  projectSummary: z.string().optional(),
  reasonForCalling: z.string().optional(),
  wantCompleteSystem: z.string().optional(),
  allocatedBudget: z.string().optional(),
  stepsForDecision: z.string().optional(),
  leadBuyingIntention: z.string().optional(),
  expectedETA: z.string().optional(),
});

export type newLeadType = z.infer<typeof newLeadSchema>;
export type newLeadInitialValuesType = z.infer<
  typeof newLeadInitialValuesSchema
>;
