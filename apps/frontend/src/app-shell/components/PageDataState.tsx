import type { ReactNode } from "react";

import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState, type EmptyStateProps } from "@/shared/components/EmptyState";
import type { AppApiError } from "@/types/api";

/**
 * Standardizes the loading/empty/error decision every data-driven
 * page has to make - not a new visual primitive (ErrorState/EmptyState
 * are already correct and reused untouched), just one real, consistent
 * place to make that three-way branch instead of each rebuilt page
 * repeating its own isLoading/isError/data.length===0 chain slightly
 * differently.
 *
 * `loading` takes a ReactNode rather than a boolean+skeleton-shape,
 * since a real skeleton must match its page's actual final layout
 * (established this session) - there is no one generic skeleton that
 * fits every page correctly, so the caller supplies its own.
 */
export function PageDataState({
  isLoading,
  isError,
  error,
  isEmpty,
  loading,
  emptyProps,
  onRetry,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: AppApiError | Error | null;
  isEmpty: boolean;
  loading: ReactNode;
  emptyProps: EmptyStateProps;
  onRetry?: () => void;
  children: ReactNode;
}) {
  if (isLoading) {
    return <>{loading}</>;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return <EmptyState {...emptyProps} />;
  }

  return <>{children}</>;
}
