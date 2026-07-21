import type { AppApiError } from "@/types/api";

/**
 * Flattens the backend's Zod validation error shape (formErrors +
 * fieldErrors, see types/api.ts) into a flat string[] for
 * FormErrorSummary. Field names are prefixed so a person can tell which
 * field a message refers to even outside the form itself.
 */
export function flattenApiErrors(error: AppApiError | null | undefined): string[] {
  if (!error) return [];

  if (!error.errors) {
    return [error.message];
  }

  const messages: string[] = [...error.errors.formErrors];

  for (const [field, fieldMessages] of Object.entries(error.errors.fieldErrors)) {
    for (const message of fieldMessages) {
      messages.push(`${field}: ${message}`);
    }
  }

  return messages.length > 0 ? messages : [error.message];
}
