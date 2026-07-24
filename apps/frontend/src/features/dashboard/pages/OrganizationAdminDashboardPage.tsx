import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { AnalyticsWidget } from "@/widgets/org-admin/AnalyticsWidget";
import { DepartmentStatisticsWidget } from "@/widgets/org-admin/DepartmentStatisticsWidget";
import { UserManagementShortcutWidget } from "@/widgets/org-admin/UserManagementShortcutWidget";
import { ActivitiesShortcutWidget } from "@/widgets/org-admin/ActivitiesShortcutWidget";
import { PlacementsOverviewWidget } from "@/widgets/org-admin/PlacementsOverviewWidget";

export function OrganizationAdminDashboardPage() {
  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />
      <DashboardHero />
      <DashboardGrid>
        <AnalyticsWidget />
        <DepartmentStatisticsWidget />
        <UserManagementShortcutWidget />
        <ActivitiesShortcutWidget />
        <PlacementsOverviewWidget />
      </DashboardGrid>
    </div>
  );
}
