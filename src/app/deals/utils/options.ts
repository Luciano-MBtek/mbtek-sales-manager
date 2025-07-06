import { canadaProvinces, USStates } from "@/types";

export const countryOptions = [
  { label: "USA", value: "USA" },
  { label: "Canada", value: "Canada" },
];

export const stateOptions = USStates.map((state) => ({
  label: state,
  value: state,
}));
export const provinceOptions = canadaProvinces.map(({ label, value }) => ({
  label,
  value,
}));
