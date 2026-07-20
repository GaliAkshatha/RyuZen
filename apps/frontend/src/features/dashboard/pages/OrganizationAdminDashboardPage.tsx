import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { AnalyticsWidget } from "@/widgets/org-admin/AnalyticsWidget";
import { DepartmentStatisticsWidget } from "@/widgets/org-admin/DepartmentStatisticsWidget";
import { UserManagementShortcutWidget } from "@/widgets/org-admin/UserManagementShortcutWidget";
import { ActivityManagementShortcutWidget } from "@/widgets/org-admin/ActivityManagementShortcutWidget";
import { PlacementsOverviewWidget } from "@/widgets/org-admin/PlacementsOverviewWidget";

export function OrganizationAdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHero />
      <DashboardGrid>
        <AnalyticsWidget />
        <DepartmentStatisticsWidget />
        <UserManagementShortcutWidget />
        <ActivityManagementShortcutWidget />
        <PlacementsOverviewWidget />
      </DashboardGrid>
    </div>
  );
}
