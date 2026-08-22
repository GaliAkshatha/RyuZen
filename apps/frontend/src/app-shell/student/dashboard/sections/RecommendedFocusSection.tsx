import { Sparkles } from "lucide-react";

import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

/**
 * AI recommendations, explicitly NOT presented as system tasks: no
 * checkboxes, no "N remaining" language, no completion state (there is
 * nothing to complete - these aren't assigned). Each row carries a
 * sparkle icon (an AI-origin marker) instead of a checkbox, so the
 * visual language itself communicates "suggestion," not "task."
 */
export function RecommendedFocusSection() {
  const { data: score, isLoading, isError } = useCareerScore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLoader key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  const recommendations = isError ? [] : (score?.recommendations ?? []).slice(0, 4);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Recommended Focus
      </div>
      {recommendations.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          Nothing to recommend right now. Check back after your next activity.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recommendations.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="font-body text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
