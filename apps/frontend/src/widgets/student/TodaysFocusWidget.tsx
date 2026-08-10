import { CheckSquare } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

/**
 * "What should I work on next to improve my chances of getting
 * placed?" - the exact question the wireframe's Student dashboard is
 * meant to answer. Genuinely real, not a fabricated checklist: pulls
 * directly from GetCareerScoreUseCase's own AI-generated
 * `recommendations`, the same real data CareerScoreWidget's "View
 * breakdown" link leads to. No separate "focus item" backend concept
 * exists or needs to - this is the real thing, framed as today's
 * actionable list instead of a paragraph.
 */
export function TodaysFocusWidget() {
  const { data: score, isLoading, isError } = useCareerScore();

  const items = (score?.recommendations ?? []).slice(0, 4);

  return (
    <WidgetCard title="Today's Focus" icon={CheckSquare} wired>
      {isLoading ? (
        <Spinner size="sm" />
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
