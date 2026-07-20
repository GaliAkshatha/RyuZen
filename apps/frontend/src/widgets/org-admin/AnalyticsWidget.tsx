import { BarChart3 } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function AnalyticsWidget() {
  return (
    <WidgetCard
      title="Analytics"
      icon={BarChart3}
      wired={false}
      milestone="AD5"
      placeholderMessage="Organization-wide analytics (users, activities, clubs, events) will appear here."
    />
  );
}
