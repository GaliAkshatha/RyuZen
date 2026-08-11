import { CheckSquare } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { WidgetSkeletonRows } from "@/widgets/shared/WidgetSkeletonRows";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

/**
 * Renamed from "Today's Focus" - these are AI-generated recommendations
 * from GetCareerScoreUseCase, not tasks with a literal due-today
 * deadline. "Your Focus" doesn't claim a time commitment the backend
 * doesn't make.
 */
export function YourFocusWidget() {
  const { data: score, isLoading, isError } = useCareerScore();

  const items = (score?.recommendations ?? []).slice(0, 4);

  return (
    <WidgetCard title="Your Focus" icon={CheckSquare} wired>
      {isLoading ? (
        <WidgetSkeletonRows />
      ) : isError || items.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          Nothing urgent right now — check back after your next activity or submission.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" aria-hidden="true" />
              <span className="font-body text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
