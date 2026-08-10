import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { NotificationsWidget } from "@/widgets/shared/NotificationsWidget";
import { AiLauncherWidget } from "@/widgets/shared/AiLauncherWidget";
import { PlacementsOverviewWidget } from "@/widgets/org-admin/PlacementsOverviewWidget";
import { ActiveDrivesWidget } from "@/widgets/placement-admin/ActiveDrivesWidget";

/**
 * Deliberately minimal, not a scaled-down copy of the Org Admin
 * dashboard - Placement Admin's real permissions (confirmed against
 * the backend routes this role was added to) cover only Companies,
 * Placement Drives, Job Applications, and Placement Analytics. It
 * would be misleading to show them DepartmentStatisticsWidget or
 * UserManagementShortcutWidget, which they have no ability to act on
 * ("cannot manage organizations, cannot create faculty" is an
 * explicit rule, not just an omission). Reuses PlacementsOverviewWidget
 * as-is rather than building a new one. ActiveDrivesWidget added
 * separately - real, urgency-sorted drives, answering "what should I
 * look at today" rather than just static totals.
 */
export function PlacementAdminDashboardPage() {
  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="constellation" />
      <DashboardHero />
      <DashboardGrid>
        <PlacementsOverviewWidget />
        <ActiveDrivesWidget />
        <AiLauncherWidget />
        <NotificationsWidget />
      </DashboardGrid>
    </div>
  );
}
