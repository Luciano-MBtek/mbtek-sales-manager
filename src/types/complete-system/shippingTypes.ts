import { TechnicalStep } from "@/components/Modals/TechnicalInformation/TechnicalInformationModal";

// src/types/complete-system/shippingTypes.ts
export interface ShippingFormValues {
  sameAsBilling: boolean;
  delivery_type: string;
  dropoff_condition: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_country: string;
  shipping_zip_code: string;
}

export interface ShippingUpdateData {
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_province: string;
  shipping_zip_code: string;
  delivery_type: string;
  dropoff_condition: string;
  last_step?: string;
}

export function convertShippingFormToUpdateData(
  data: ShippingFormValues,
  nextStep?: TechnicalStep
): ShippingUpdateData {
  return {
    shipping_first_name: data.shipping_first_name,
    shipping_last_name: data.shipping_last_name,
    shipping_email: data.shipping_email,
    shipping_phone: data.shipping_phone,
    shipping_address: data.shipping_address,
    shipping_city: data.shipping_city,
    shipping_country: data.shipping_country,
    shipping_province: data.shipping_province,
    shipping_zip_code: data.shipping_zip_code,
    delivery_type: data.delivery_type,
    dropoff_condition: data.dropoff_condition,
    ...(nextStep ? { last_step: nextStep } : {}),
  };
}
