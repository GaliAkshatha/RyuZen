import { DashboardGrid } from "@/features/dashboard/components/DashboardGrid";

import { DashboardHero } from "@/widgets/shared/HeroWidget";
import { NotificationsWidget } from "@/widgets/shared/NotificationsWidget";
import { AiLauncherWidget } from "@/widgets/shared/AiLauncherWidget";
import { MentorshipOverviewWidget } from "@/widgets/alumni/MentorshipOverviewWidget";
import { PlacementsBrowsingWidget } from "@/widgets/alumni/PlacementsBrowsingWidget";

export function AlumniDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
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
