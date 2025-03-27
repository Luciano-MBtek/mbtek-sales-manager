import z from "zod";
import { phoneSchema } from "./newLeadSchema";
import { USStates, canadaProvinceValues, leadTypeTuple } from "@/types";

export const contactUpdateSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: phoneSchema.optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),

  lead_type: z
    .enum(leadTypeTuple, {
      errorMap: () => ({
        message: "Please select a valid lead type",
      }),
    })
    .optional()
    .or(z.literal("")),

  country_us_ca: z
    .union([z.literal("USA"), z.literal("Canada"), z.literal("")])
    .optional(),

  address: z.string().optional().or(z.literal("")),

  province_territory: z
    .enum(canadaProvinceValues, {
      errorMap: () => ({
        message: "Please select a valid province",
      }),
    })
    .optional()
    .or(z.literal("")),

  state_usa: z
    .enum(USStates, {
      errorMap: () => ({ message: "Please select a valid state" }),
    })
    .optional()
    .or(z.literal("")),

  city: z.string().optional().or(z.literal("")),
});

export type ContactUpdateFormValues = z.infer<typeof contactUpdateSchema>;
