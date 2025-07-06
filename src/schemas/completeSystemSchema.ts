import z from "zod";
import { phoneSchema } from "./newLeadSchema";
import { canadaProvinceValues, USStates, yesOrNoTuple } from "@/types";

export const stepOneCompleteSystemSchema = z
  .object({
    products: z
      .array(
        z.object({
          id: z.string().min(1, "Product ID is required"),
          name: z.string(),
          price: z.number(),
          quantity: z.number().min(1, "Quantity must be at least 1"),
          unitDiscount: z.number().optional(),
          isMain: z.boolean().optional(),
          sku: z.string().optional(),
        })
      )
      .min(1, "At least one product is required"),
    splitPayment: z.enum(yesOrNoTuple, {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
    purchaseOptionId: z.string().optional(),
    dealId: z.string(),
    contactId: z.string(),
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

    if (
      data.splitPayment === "Yes" &&
      (!data.purchaseOptionId || data.purchaseOptionId.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Purchase Option ID is required when split payment is Yes",
        path: ["purchaseOptionId"],
      });
    }
  });

export const newCompleteSystemSchema = z.discriminatedUnion("country", [
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

export type newCompleteSystemType = z.infer<typeof newCompleteSystemSchema>;

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
