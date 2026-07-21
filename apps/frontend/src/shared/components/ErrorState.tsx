import { AlertTriangle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/shared/ui/Button";
import type { AppApiError } from "@/types/api";

export interface ErrorStateProps {
  error?: AppApiError | Error | null;
  /** Overrides the message derived from `error`. */
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function describeError(error: AppApiError | Error | null | undefined): string {
  if (!error) return "Something went wrong.";

  const apiError = error as AppApiError;

  if (apiError.isNetworkError) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  if (apiError.isRateLimited) {
    return "Too many requests. Please wait a moment and try again.";
  }

  return error.message || "Something went wrong.";
}

/**
 * Per the design skill: "errors don't apologize, and they are never
 * vague about what happened." `describeError` always surfaces the real
 * backend message where one exists, rather than a generic placeholder.
 */
export function ErrorState({ error, message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-10 text-center",
        className,
      )}
    >
      <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
      <p className="font-body text-sm text-foreground">{message ?? describeError(error)}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      )}
    </div>
  );
}
