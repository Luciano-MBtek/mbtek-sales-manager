import { canadaProvinceValues, USStates, yesOrNoTuple } from "@/types";
import z from "zod";

export const stepTwoSingleProductSchema = z
  .object({
    products: z
      .array(
        z.object({
          id: z.string(),
          image: z.string().optional(),
          name: z.string(),
          price: z.number(),
          selected: z.boolean().optional(),
          sku: z
            .string()
            .min(1, "SKU is required, please inform Sales Director"),
          quantity: z.number(),
          isMain: z.boolean().optional(),
        })
      )
      .min(1, "You must select at least one product"),

    splitPayment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
  })
  .superRefine((data, ctx) => {
    const mainProductSelected = data.products.some((product) => product.isMain);
    if (!mainProductSelected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must select a main product",
        path: ["products"],
      });
    }
  });

export const stepOneProductSchema = z.discriminatedUnion("country", [
  z.object({
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
  }),
  z.object({
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
  }),
]);

export const newSingleProductSchema = z.discriminatedUnion("country", [
  z.object({
    name: z.string().min(1, "Unknown name"),
    id: z.string(),
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
      })
    ),
    splitPayment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
  }),
  z.object({
    name: z.string().min(1, "Unknown name"),
    lastname: z.string().min(1, "Unknown lastname"),
    email: z.string().email(),
    id: z.string(),
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
        quantity: z.number(),
      })
    ),
    splitPayment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
  }),
]);

export const singleProductInitialValuesSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  state: z.string().optional(),
  province: z.string().optional(),
  products: z
    .array(
      z.object({
        id: z.string(),
        image: z.string().optional(),
        name: z.string(),
        price: z.number(),
        selected: z.boolean().optional(),
        sku: z.string(),
        quantity: z.number(),
      })
    )
    .optional(),
  splitPayment: z.string().optional(),
});

export type newSingleProductType = z.infer<typeof newSingleProductSchema>;
export type singleProductInitialValuesType = z.infer<
  typeof singleProductInitialValuesSchema
>;
