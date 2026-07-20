import { Bell } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function NotificationsWidget() {
  return (
    <WidgetCard
      title="Announcements"
      icon={Bell}
      wired={false}
      milestone="CM1"
      placeholderMessage="Recent announcements and alerts will appear here."
    />
  );
}
