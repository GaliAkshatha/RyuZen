import { GraduationCap } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Named "Mentorship overview (if mentoring)" in the approved report
 * §7. F5's backend route research found NO alumni-accessible route on
 * mentorship.routes.ts at all (SUPER_ADMIN/ORG_ADMIN/FACULTY only) —
 * the same gap already documented in navRegistry.ts. This widget slot
 * still exists per the roadmap's requirement to build every named
 * widget, but its milestone reference points at that same open
 * question rather than a real future milestone, since none currently
 * owns building alumni-facing mentorship data.
 */
export function MentorshipOverviewWidget() {
  return (
    <WidgetCard
      title="Mentorship"
      icon={GraduationCap}
      wired={false}
      milestone="A4*"
      placeholderMessage="No alumni-accessible mentorship endpoint currently exists on the backend (see F5's documented gap) — this slot is reserved pending backend clarification, not scheduled against a concrete milestone."
    />
  );
}
