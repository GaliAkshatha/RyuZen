import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { TenantManagementWidget } from "@/widgets/super-admin/TenantManagementWidget";
import { GlobalAnalyticsWidget } from "@/widgets/super-admin/GlobalAnalyticsWidget";
import { AuditLogsWidget } from "@/widgets/super-admin/AuditLogsWidget";
import { PlatformHealthWidget } from "@/widgets/super-admin/PlatformHealthWidget";

export function SuperAdminDashboardPage() {
  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="arcane-grid" />
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
