import { Users } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Named "Student Progress" per the approved report §7. Wires to A4
 * (Mentorship) since it's built against the mentee list — the only
 * faculty-facing view of "which students am I responsible for" the
 * current backend surface supports (student.routes.ts itself is
 * SUPER_ADMIN/ORG_ADMIN-only, confirmed in F5).
 */
export function StudentProgressWidget() {
  return (
    <WidgetCard
      title="Student Progress"
      icon={Users}
      wired={false}
      milestone="A4"
      placeholderMessage="An overview of your mentees' progress will appear here."
    />
  );
}
