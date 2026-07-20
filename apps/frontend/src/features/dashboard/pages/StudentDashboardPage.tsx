import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";

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

export function StudentDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHero />
      <DashboardGrid>
        <XpPointsWidget />
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
