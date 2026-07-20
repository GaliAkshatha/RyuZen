import { Network } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function DepartmentStatisticsWidget() {
  return (
    <WidgetCard
      title="Department Statistics"
      icon={Network}
      wired={false}
      milestone="A1"
      placeholderMessage="Department headcounts and breakdowns will appear here."
    />
  );
}
