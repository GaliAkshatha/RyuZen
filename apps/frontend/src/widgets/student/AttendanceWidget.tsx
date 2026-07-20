import { CheckCircle2 } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function AttendanceWidget() {
  return (
    <WidgetCard
      title="Attendance"
      icon={CheckCircle2}
      wired={false}
      milestone="C3"
      placeholderMessage="Your event attendance record will appear here."
    />
  );
}
