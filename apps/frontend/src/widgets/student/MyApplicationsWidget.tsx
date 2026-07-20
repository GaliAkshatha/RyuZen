import { Send } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function MyApplicationsWidget() {
  return (
    <WidgetCard
      title="My Applications"
      icon={Send}
      wired={false}
      milestone="PL3"
      placeholderMessage="The placement drives you've applied to, and their status, will appear here."
    />
  );
}
