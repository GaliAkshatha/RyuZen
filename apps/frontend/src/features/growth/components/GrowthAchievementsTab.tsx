import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";

import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";

import type { AchievementResponseDto } from "@/features/achievements/types/achievement.types";

/**
 * Portfolio's own achievements array only ever contains VERIFIED
 * ones (confirmed against GetUserPortfolioUseCase's own filtering) -
 * a real, meaningful distinction from the achievements the student
 * has SUBMITTED but not yet had reviewed. Status badge still shown
 * here for consistency even though every entry is verified, since
 * this component may reasonably be reused later where that's not true.
 */
export function GrowthAchievementsTab({ achievements }: { achievements: AchievementResponseDto[] }) {
  const navigate = useNavigate();

  if (achievements.length === 0) {
    return (
      <EmptyState
        title="No verified achievements yet"
        description="Submit an achievement to have it reviewed and added to your growth profile."
        actionLabel="Submit an achievement"
        onAction={() => navigate("/app/career/achievements")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/60 p-3"
        >
          <div className="flex items-center gap-3">
            <Trophy className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-body text-sm font-medium text-foreground">{achievement.title}</p>
              <p className="font-body text-xs text-muted-foreground">
                {new Date(achievement.achievementDate).toLocaleDateString()}
                {achievement.level && ` · ${humanizeEnumValue(achievement.level)}`}
              </p>
            </div>
          </div>
          <StatusBadge status={achievement.status} />
        </div>
      ))}
    </div>
  );
}
