import { canadaProvinces } from "@/types";
export interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}
export interface ContactUpdateData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  state?: string;
  province?: string;
  country_us_ca: string;
  last_step?: string;
  [key: string]: string | undefined;
}
export function convertContactFormToUpdateData(
  data: ContactFormValues
): ContactUpdateData {
  // Create a map of province labels to values for quick lookup
  const provinceMap = Object.fromEntries(
    canadaProvinces.map((p) => [p.label, p.value])
  );

  return {
    firstname: data.firstName,
    lastname: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    zip: data.zipCode,
    country_us_ca: data.country,
    ...(data.country === "USA"
      ? { state: data.state }
      : { province_territory: provinceMap[data.state] || data.state }),
  };
}
