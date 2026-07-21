import { AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";

export interface FormErrorSummaryProps {
  errors: string[];
  className?: string;
}

/**
 * Deliberately accepts a plain `string[]`, not React Hook Form's
 * `FieldErrors` type directly — RHF isn't installed until P1 (Auth
 * Pages), and this component has no reason to depend on it. P1 wires
 * RHF's field errors and this component together using
 * `flattenApiErrors` below (for backend 400s) plus its own mapping of
 * RHF's FieldErrors to strings.
 */
export function FormErrorSummary({ errors, className }: FormErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-body text-sm font-medium text-destructive">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        {errors.length === 1 ? "There is an error" : `There are ${errors.length} errors`}
      </div>
      <ul className="list-inside list-disc font-body text-sm text-destructive">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
