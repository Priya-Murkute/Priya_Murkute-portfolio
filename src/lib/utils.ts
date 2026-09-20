import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Keeps `value` between `low` and `high`. */
export function clamp(value: number, low: number, high: number) {
  return Math.min(Math.max(value, low), high);
}
