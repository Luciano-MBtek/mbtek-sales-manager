import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDatePlus30Days(): string {
  const today = new Date();
  const futureDate = new Date(today.setDate(today.getDate() + 30));

  return futureDate.toISOString().split("T")[0];
}

export function getDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}
