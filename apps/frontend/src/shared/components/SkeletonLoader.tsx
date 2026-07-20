import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export function SkeletonLoader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

/** Convenience preset for a table/list of rows while data loads. */
export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonLoader key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

/** Convenience preset for a StatCard-style dashboard grid while loading. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg border border-border p-6", className)}>
      <SkeletonLoader className="h-4 w-24" />
      <SkeletonLoader className="h-8 w-16" />
    </div>
  );
}
