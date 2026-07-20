import { TrendingUp } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Explicitly named in 03_UI_Blueprint.md's Org Admin Dashboard section
 * — the one dashboard widget with direct backing in the frontend
 * documentation, not just the backend. Wires to PL4 (Placement
 * Analytics), which composes the exact same use case AD5's Admin
 * Dashboard will also reuse (see PL4/AD5's roadmap notes).
 */
export function PlacementsOverviewWidget() {
  return (
    <WidgetCard
      title="Placements Overview"
      icon={TrendingUp}
      wired={false}
      milestone="PL4"
      placeholderMessage="Placement drive and application statistics will appear here."
    />
  );
}
