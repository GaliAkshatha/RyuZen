import { BarChart3 } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function GlobalAnalyticsWidget() {
  return (
    <WidgetCard
      title="Global Analytics"
      icon={BarChart3}
      wired={false}
      milestone="AD5"
      placeholderMessage="Platform-wide analytics across all organizations will appear here."
    />
  );
}
