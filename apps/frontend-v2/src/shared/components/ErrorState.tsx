import { AlertTriangle } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/ui/Button";
import type { AppApiError } from "@/shared/types/api.types";

export interface ErrorStateProps {
  error?: AppApiError | Error | null;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function describeError(error: AppApiError | Error | null | undefined): string {
  if (!error) return "Something went wrong.";
  if ("statusCode" in error) {
    if (error.statusCode === 403) return "You don't have access to this.";
    if (error.statusCode === 404) return "Not found.";
    if (error.statusCode === 401) return "Your session has expired. Please log in again.";
    return error.message || "Something went wrong.";
  }
  return error.message || "Something went wrong.";
}

export function ErrorState({ error, message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 py-10 text-center", className)}>
      <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
      <p className="text-sm font-medium text-foreground">{message ?? describeError(error)}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
