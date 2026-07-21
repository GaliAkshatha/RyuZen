import { Activity } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Flagged in the roadmap's own AD5 notes: no dedicated health-metrics
 * endpoint exists on the backend beyond basic DB connectivity. When
 * AD5 wires this, it will be honestly scoped to whatever the backend
 * actually reports — not an invented uptime/metrics dashboard.
 */
export function PlatformHealthWidget() {
  return (
    <WidgetCard
      title="Platform Health"
      icon={Activity}
      wired={false}
      milestone="AD5"
      placeholderMessage="Basic platform connectivity status will appear here. No dedicated health-metrics endpoint exists on the backend beyond this."
    />
  );
}
