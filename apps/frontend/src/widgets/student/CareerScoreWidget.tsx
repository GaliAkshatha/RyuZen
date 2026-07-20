import { Gauge } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function CareerScoreWidget() {
  return (
    <WidgetCard
      title="Career Score"
      icon={Gauge}
      wired={false}
      milestone="AI3"
      placeholderMessage="Your overall career readiness score will appear here."
    />
  );
}
