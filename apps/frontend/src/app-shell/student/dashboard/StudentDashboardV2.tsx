import { useAuth } from "@/contexts/AuthContext";

import { CareerScoreSection } from "./sections/CareerScoreSection";
import { RecommendedFocusSection } from "./sections/RecommendedFocusSection";
import { UpcomingSection } from "./sections/UpcomingSection";
import { GrowthSnapshotSection } from "./sections/GrowthSnapshotSection";
import { CareerAISection } from "./sections/CareerAISection";
import { PlacementSection } from "./sections/PlacementSection";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Built from scratch per the approved backend data map - no old
 * widget files reused, no old layout copied. Every section is its own
 * independently-loading real component (a failed Upcoming query does
 * not block Career Score, etc. - React Query's per-hook isolation
 * already gives this for free, no extra plumbing needed).
 *
 * Header is deliberately minimal - full identity already lives in the
 * new sidebar (StudentIdentity), so this is a one-line greeting, not a
 * hero banner.
 */
export function StudentDashboardV2() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-xl font-semibold text-foreground">
        {greeting()}
        {firstName ? `, ${firstName}` : ""}
      </h1>

      {/* Primary row: Career Score + Recommended Focus + Upcoming */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CareerScoreSection />
        <RecommendedFocusSection />
        <UpcomingSection />
      </div>

      <GrowthSnapshotSection />

      <CareerAISection />

      <PlacementSection />
    </div>
  );
}
