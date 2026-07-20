import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { NotificationsWidget } from "@/widgets/shared/NotificationsWidget";
import { AssignedActivitiesWidget } from "@/widgets/faculty/AssignedActivitiesWidget";
import { StudentProgressWidget } from "@/widgets/faculty/StudentProgressWidget";
import { PendingReviewsWidget } from "@/widgets/faculty/PendingReviewsWidget";
import { AttendanceSummaryWidget } from "@/widgets/faculty/AttendanceSummaryWidget";

export function FacultyDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHero />
      <DashboardGrid>
        <AssignedActivitiesWidget />
        <StudentProgressWidget />
        <PendingReviewsWidget />
        <AttendanceSummaryWidget />
        <NotificationsWidget />
      </DashboardGrid>
    </div>
  );
}
