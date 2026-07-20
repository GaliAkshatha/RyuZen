import { CheckCircle2 } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function AttendanceSummaryWidget() {
  return (
    <WidgetCard
      title="Attendance Summary"
      icon={CheckCircle2}
      wired={false}
      milestone="C3"
      placeholderMessage="Attendance summaries for events you advise will appear here."
    />
  );
}
