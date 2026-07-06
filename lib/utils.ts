import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(value: number) {
  return value.toLocaleString("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency"
  });
}
