import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { LevelProgressRing } from "@/shared/components/LevelProgressRing";

import { useCareerScore } from "@/features/career-score/hooks/useCareerScore";

/** Wired in AI3. Ring reuses the exact same visual motif as XpPointsWidget's Level ring — same language, different number. */
export function CareerScoreWidget() {
  const { data: score, isLoading } = useCareerScore();

  return (
    <WidgetCard title="Career Score" icon={Gauge} wired>
      {isLoading || !score ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex items-center gap-4">
          <LevelProgressRing level={score.careerScore} progress={score.careerScore / 100} size={72} label="Score" />
          <div className="flex flex-col gap-1">
            <p className="font-body text-sm font-medium text-primary">{score.label}</p>
            <Link
              to="/app/ai/career-score"
              className="font-body text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              View breakdown
            </Link>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
