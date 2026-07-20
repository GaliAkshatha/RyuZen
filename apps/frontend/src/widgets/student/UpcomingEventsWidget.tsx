import { Calendar } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function UpcomingEventsWidget() {
  return (
    <WidgetCard
      title="Upcoming Events"
      icon={Calendar}
      wired={false}
      milestone="C2"
      placeholderMessage="Events you're registered for, or that are open to you, will appear here."
    />
  );
}
