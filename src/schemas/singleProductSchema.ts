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
          unitDiscount: z.number(),
          isMain: z.boolean().optional(),
        })
      )
      .min(1, "You must select at least one product"),

    splitPayment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
    /*  customShipment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }), */
    shipmentCost: z.number().nullable().optional(),

    rates: z
      .array(
        z.object({
          costLoaded: z.number(),
          carrierScac: z.string(),
          estimatedDeliveryDate: z.string().datetime(),
        })
      )
      .optional(),
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
    /* if (
      data.customShipment === "Yes" &&
      (!data.shipmentCost || data.shipmentCost.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Shipment cost is required when custom shipment is Yes",
        path: ["shipmentCost"],
      });
    } */
  });

export const stepOneProductSchema = z.discriminatedUnion("country", [
  z.object({
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
        unitDiscount: z.number(),
        quantity: z.number(),
        isMain: z.boolean(),
      })
    )
    .optional(),
  splitPayment: z.string().optional(),
  rates: z
    .array(
      z.object({
        costLoaded: z.number(),
        carrierScac: z.string(),
        estimatedDeliveryDate: z.string().datetime(),
      })
    )
    .optional(),
  customShipment: z.string().optional(),
  shipmentCost: z.number().optional(),
});

export type newSingleProductType = z.infer<typeof newSingleProductSchema>;
export type singleProductInitialValuesType = z.infer<
  typeof singleProductInitialValuesSchema
>;
export type RatesType = z.infer<typeof stepTwoSingleProductSchema>["rates"];
