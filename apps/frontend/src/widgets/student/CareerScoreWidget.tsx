import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

/** Wired in AI3. */
export function CareerScoreWidget() {
  const { data: score, isLoading } = useCareerScore();

  return (
    <WidgetCard title="Career Score" icon={Gauge} wired>
      {isLoading || !score ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <p className="font-display text-3xl font-semibold text-foreground">
              {score.careerScore}
            </p>
            <p className="font-body text-sm text-muted-foreground">/ 100</p>
          </div>
          <p className="font-body text-sm text-primary">{score.label}</p>
          <Link
            to="/app/ai/career-score"
            className="font-body text-xs text-primary underline underline-offset-4"
          >
            View breakdown
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
