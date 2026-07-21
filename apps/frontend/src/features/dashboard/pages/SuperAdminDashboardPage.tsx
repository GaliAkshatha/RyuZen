import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { TenantManagementWidget } from "@/widgets/super-admin/TenantManagementWidget";
import { GlobalAnalyticsWidget } from "@/widgets/super-admin/GlobalAnalyticsWidget";
import { AuditLogsWidget } from "@/widgets/super-admin/AuditLogsWidget";
import { PlatformHealthWidget } from "@/widgets/super-admin/PlatformHealthWidget";

export function SuperAdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHero />
      <DashboardGrid>
        <TenantManagementWidget />
        <GlobalAnalyticsWidget />
        <AuditLogsWidget />
        <PlatformHealthWidget />
      </DashboardGrid>
    </div>
  );
}
