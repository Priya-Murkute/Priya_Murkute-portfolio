import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names, letting later Tailwind utilities win.
 * Components pasted from motion-primitives.com import this as `@/lib/utils`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
