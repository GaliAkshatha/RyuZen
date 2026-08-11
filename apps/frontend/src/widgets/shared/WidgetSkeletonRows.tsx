import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

/**
 * Matches the real row shape shared by Your Focus, Upcoming, and My
 * Applications (icon/checkbox + label + trailing badge), so the
 * loading state occupies the same footprint as the real content
 * instead of collapsing to a tiny centered spinner or leaving a large
 * blank gap while data loads.
 */
export function WidgetSkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-2 px-2 py-1.5">
          <SkeletonLoader className="h-4 w-4 shrink-0 rounded" />
          <SkeletonLoader className="h-3.5 flex-1" />
          <SkeletonLoader className="h-4 w-10 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}
