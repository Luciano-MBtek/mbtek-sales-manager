// src/types/complete-system/billingTypes.ts
export interface BillingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface BillingUpdateData {
  billing_zip: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_email: string;
  billing_phone: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  last_step?: string;
}

export function convertBillingFormToUpdateData(
  data: BillingFormValues,
  nextStep?: string
): BillingUpdateData {
  return {
    billing_zip: data.zipCode,
    billing_first_name: data.firstName,
    billing_last_name: data.lastName,
    billing_email: data.email,
    billing_phone: data.phone,
    billing_address: data.address,
    billing_city: data.city,
    billing_state: data.state,
    billing_country: data.country,
    ...(nextStep ? { last_step: nextStep } : {}),
  };
}
