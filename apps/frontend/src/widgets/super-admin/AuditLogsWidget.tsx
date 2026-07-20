import { ScrollText } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function AuditLogsWidget() {
  return (
    <WidgetCard
      title="Audit Logs"
      icon={ScrollText}
      wired={false}
      milestone="AD4"
      placeholderMessage="Recent audit log entries across the platform will appear here."
    />
  );
}
