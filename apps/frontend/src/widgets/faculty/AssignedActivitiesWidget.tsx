import { ClipboardList } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function AssignedActivitiesWidget() {
  return (
    <WidgetCard
      title="Assigned Activities"
      icon={ClipboardList}
      wired={false}
      milestone="AC1"
      placeholderMessage="Activities you've created or are managing will appear here."
    />
  );
}
