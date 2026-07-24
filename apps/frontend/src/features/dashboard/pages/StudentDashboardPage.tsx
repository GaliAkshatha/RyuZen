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
import { UpcomingEventsWidget } from "@/widgets/student/UpcomingEventsWidget";
import { LeaderboardSnippetWidget } from "@/widgets/student/LeaderboardSnippetWidget";
import { AttendanceWidget } from "@/widgets/student/AttendanceWidget";
import { CareerScoreWidget } from "@/widgets/student/CareerScoreWidget";
import { MyApplicationsWidget } from "@/widgets/student/MyApplicationsWidget";

/**
 * The showcase page for the product-experience redesign — the visual
 * language established here (atmosphere layer, hero-level Level ring,
 * featured-widget hierarchy) is the template the other 4 dashboards
 * follow next, not a one-off treatment.
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

      <DashboardGrid>
        <div className="md:col-span-2 xl:col-span-1">
          <XpPointsWidget />
        </div>
        <RecentActivitiesWidget />
        <UpcomingEventsWidget />
        <LeaderboardSnippetWidget />
        <AttendanceWidget />
        <AiLauncherWidget />
        <NotificationsWidget />
        <CareerScoreWidget />
        <MyApplicationsWidget />
      </DashboardGrid>
    </div>
  );
}
