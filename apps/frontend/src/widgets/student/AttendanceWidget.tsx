import { CheckCircle2 } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * C3 (Event Attendance) was built, but discovered a real backend gap
 * that keeps this widget from being wireable: GET /events/:id/
 * registrations explicitly excludes STUDENT (confirmed this milestone,
 * see RegisterForEventSection.tsx and SubmitFeedbackSection.tsx for the
 * same finding). A student has no backend-supported way to look up
 * their own attendance record across events. Marked with the same "*"
 * convention as Mentorship's and Alumni's unresolved gaps — not
 * scheduled against a concrete future milestone, since none currently
 * owns closing this backend gap.
 */
export function AttendanceWidget() {
  return (
    <WidgetCard
      title="Attendance"
      icon={CheckCircle2}
      wired={false}
      milestone="C3*"
      placeholderMessage="No backend-supported way exists yet for a student to look up their own attendance record (see the C3 milestone notes) — this slot is reserved pending a backend change, not scheduled against a concrete milestone."
    />
  );
}
