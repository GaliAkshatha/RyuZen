import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

/**
 * Real AI narrative from GetCareerScoreUseCase, not a canned message -
 * the same generation that powers the Career Score breakdown page,
 * surfaced here as the dashboard's "AI Insight" moment per the
 * wireframe.
 */
export function AIInsightWidget() {
  const { data: score, isLoading, isError } = useCareerScore();

  return (
    <WidgetCard title="AI Insight" icon={Sparkles} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : isError || !score?.narrative ? (
        <p className="font-body text-sm text-muted-foreground">
          Your AI insight will appear here once there's enough activity to analyze.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="line-clamp-4 font-body text-sm text-foreground">{score.narrative}</p>
          <Link
            to="/app/ai/career-score"
            className="w-fit font-body text-xs text-primary underline underline-offset-4"
          >
            See full breakdown
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
