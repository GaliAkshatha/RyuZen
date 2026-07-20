import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard shadcn/ui className helper (clsx + tailwind-merge), placed
 * here rather than at shadcn's conventional `@/lib/utils` path since
 * this project's own architecture doc (01_Frontend_Architecture.md)
 * defines a `utils/` folder for cross-feature utilities, not `lib/`.
 * Every primitive in shared/ui imports this as `@/utils/cn`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
