import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { LevelProgressRing } from "@/shared/components/LevelProgressRing";
import { computeLevelProgress } from "@/utils/xpLevel";

import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { NotificationsWidget } from "@/widgets/shared/NotificationsWidget";
import { AiLauncherWidget } from "@/widgets/shared/AiLauncherWidget";
import { XpPointsWidget } from "@/widgets/student/XpPointsWidget";
import { RecentActivitiesWidget } from "@/widgets/student/RecentActivitiesWidget";
import { LeaderboardSnippetWidget } from "@/widgets/student/LeaderboardSnippetWidget";
import { AttendanceWidget } from "@/widgets/student/AttendanceWidget";
import { CareerScoreWidget } from "@/widgets/student/CareerScoreWidget";
import { MyApplicationsWidget } from "@/widgets/student/MyApplicationsWidget";
import { TodaysFocusWidget } from "@/widgets/student/TodaysFocusWidget";
import { UpcomingWidget } from "@/widgets/student/UpcomingWidget";
import { AIInsightWidget } from "@/widgets/student/AIInsightWidget";

/**
 * Follows the wireframe's real vertical flow deliberately, not a flat
 * grid of equal-weight cards: Career Score (featured, full-width) ->
 * Today's Focus + Upcoming (the two "what do I do now" answers,
 * side by side) -> Growth/Activity (the supporting detail) -> AI
 * Insight -> Placement. The question this page answers is "what
 * should I work on next to improve my chances of getting placed" -
 * the layout order is the answer to that question, not alphabetical
 * or incidental.
 */
export function StudentDashboardPage() {
  const { data: entry } = useMyLeaderboardEntry();
  const progress = entry ? computeLevelProgress(entry.totalPoints) : null;

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="particles" />

      <DashboardHero
        actions={
          progress ? (
            <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
              <LevelProgressRing level={progress.level} progress={progress.progress} size={56} />
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold leading-none text-foreground">
                  {entry!.totalPoints.toLocaleString()} XP
                </span>
                <span className="font-body text-xs text-muted-foreground">Rank #{entry!.rank}</span>
              </div>
            </div>
          ) : undefined
        }
      />

      {/* Career Score + Progress - featured, full width */}
      <CareerScoreWidget />

      {/* Today's Focus + Upcoming - the two "what do I do now" answers */}
      <DashboardGrid className="md:grid-cols-2 xl:grid-cols-2">
        <TodaysFocusWidget />
        <UpcomingWidget />
      </DashboardGrid>

      {/* Growth / Activity */}
      <DashboardGrid>
        <XpPointsWidget />
        <RecentActivitiesWidget />
        <LeaderboardSnippetWidget />
        <AttendanceWidget />
      </DashboardGrid>

      {/* AI Insight */}
      <AIInsightWidget />

      {/* Placement / Career information */}
      <DashboardGrid className="md:grid-cols-2 xl:grid-cols-2">
        <MyApplicationsWidget />
        <AiLauncherWidget />
      </DashboardGrid>

      <NotificationsWidget />
    </div>
  );
}
