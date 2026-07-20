import { ClipboardList } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function RecentActivitiesWidget() {
  return (
    <WidgetCard
      title="Recent Activities"
      icon={ClipboardList}
      wired={false}
      milestone="AC1"
      placeholderMessage="Your most recently published activities will appear here."
    />
  );
}
