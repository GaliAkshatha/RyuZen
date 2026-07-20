import { Building } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function TenantManagementWidget() {
  return (
    <WidgetCard
      title="Organizations"
      icon={Building}
      wired={false}
      milestone="AD2"
      placeholderMessage="A count and overview of all organizations on the platform will appear here."
    />
  );
}
