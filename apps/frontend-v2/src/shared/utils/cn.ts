import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Standard cn() helper - clsx for conditional classes, tailwind-merge to resolve conflicting utility classes correctly. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
