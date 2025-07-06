import { z } from "zod";
import { phoneSchema } from "./newLeadSchema";
import { canadaProvinceValues, USStates, yesOrNoTuple } from "@/types";

export const newQuickQuoteSchema = z.discriminatedUnion("country", [
  z.object({
    name: z.string().min(1, "Unknown name"),
    contactId: z.string(),
    dealId: z.string(),
    dealOwnerId: z.string(),
    phone: phoneSchema,
    lastname: z.string().min(1, "Unknown lastname"),
    email: z.string().email(),
    address: z.string().min(1, "Please enter a street address"),
    city: z.string().min(2, "Please enter a valid city name"),
    zip: z
      .string()
      .min(5, "ZIP code must be at least 5 characters")
      .max(10, "ZIP code cannot exceed 10 characters")
      .regex(/^[0-9-]+$/, "ZIP code can only contain numbers and hyphens"),
    country: z.literal("USA"),
    state: z.enum(USStates, {
      errorMap: () => ({ message: "Please select a valid state" }),
    }),
    products: z.array(
      z.object({
        id: z.string(),
        image: z.string().optional(),
        name: z.string(),
        price: z.number(),
        selected: z.boolean().optional(),
        sku: z.string(),
        quantity: z.number(),
        unitDiscount: z.number(),
        isMain: z.boolean(),
      })
    ),
    splitPayment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
    /* customShipment: z.enum(yesOrNoTuple, {
        errorMap: () => ({ message: "Please select Yes or No" }),
      }), */
    shipmentCost: z.number().optional(),
    purchaseOptionId: z.string().optional(),
  }),
  z.object({
    name: z.string().min(1, "Unknown name"),
    lastname: z.string().min(1, "Unknown lastname"),
    email: z.string().email(),
    phone: phoneSchema,
    contactId: z.string(),
    dealId: z.string(),
    dealOwnerId: z.string(),
    address: z.string().min(1, "Please enter a street address"),
    city: z.string().min(2, "Please enter a valid city name"),
    zip: z
      .string()
      .min(5, "ZIP code must be at least 5 characters")
      .max(10, "ZIP code cannot exceed 10 characters")
      .regex(/^[0-9-]+$/, "ZIP code can only contain numbers and hyphens"),
    country: z.literal("Canada"),
    province: z.enum(canadaProvinceValues, {
      errorMap: () => ({ message: "Please select a valid province" }),
    }),
    products: z.array(
      z.object({
        id: z.string(),
        image: z.string().optional(),
        name: z.string(),
        price: z.number(),
        selected: z.boolean().optional(),
        sku: z.string(),
        unitDiscount: z.number(),
        quantity: z.number(),
        isMain: z.boolean(),
      })
    ),
    splitPayment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
    /*  customShipment: z.enum(yesOrNoTuple, {
        errorMap: () => ({ message: "Please select Yes or No" }),
      }), */
    shipmentCost: z.number().optional(),
    purchaseOptionId: z.string().optional(),
  }),
]);

export type newQuickQuoteType = z.infer<typeof newQuickQuoteSchema>;
