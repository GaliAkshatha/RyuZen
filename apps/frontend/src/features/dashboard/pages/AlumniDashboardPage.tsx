import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { NotificationsWidget } from "@/widgets/shared/NotificationsWidget";
import { AiLauncherWidget } from "@/widgets/shared/AiLauncherWidget";
import { MentorshipOverviewWidget } from "@/widgets/alumni/MentorshipOverviewWidget";
import { PlacementsBrowsingWidget } from "@/widgets/alumni/PlacementsBrowsingWidget";

export function AlumniDashboardPage() {
  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="constellation" />
      <DashboardHero />
      <DashboardGrid>
        <MentorshipOverviewWidget />
        <PlacementsBrowsingWidget />
        <NotificationsWidget />
        <AiLauncherWidget />
      </DashboardGrid>
    </div>
  );
}
