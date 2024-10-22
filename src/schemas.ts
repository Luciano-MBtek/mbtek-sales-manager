import z from "zod";
import { USStates, canadaProvinceValues, leadType } from "./types";

const leadTypeTuple = leadType as [string, ...string[]];

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
    state: z.enum(canadaProvinceValues, {
      errorMap: () => ({ message: "Please select a valid province" }),
    }),
    leadType: z.enum(leadTypeTuple, {
      errorMap: () => ({ message: "Please select a valid lead type" }),
    }),
  }),
]);

export const stepThreeSchema = z.object({
  contactName: z
    .string()
    .min(5, "Please enter a contact name of at least 5 characters long"),
  contactEmail: z.string().email("Please enter a valid email"),
});

export const newDealSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.options[0].omit({ country: true }).shape,
  ...stepTwoSchema.options[1].omit({ country: true }).shape,
  ...stepThreeSchema.shape,
});

export const newDealInitialValuesSchema = z.object({
  name: z.string().optional(),
  link: z.string().optional(),
  coupon: z.string().optional(),
  discount: z.coerce.number().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional(),
});

export type NewDealType = z.infer<typeof newDealSchema>;
export type NewDealInitialValuesType = z.infer<
  typeof newDealInitialValuesSchema
>;
