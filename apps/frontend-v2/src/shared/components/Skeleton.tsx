import { cn } from "@/shared/utils/cn";

/**
 * A bare block only - callers compose real skeletons that match their
 * actual final content's dimensions, since no single generic skeleton
 * shape is correct for every page.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}
