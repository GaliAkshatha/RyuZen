import { Users } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Named "Student Progress" per the approved report §7. A4 (Mentorship)
 * was built, but discovered a real backend gap that keeps this widget
 * from being genuinely wireable as "my mentees": GET /faculty (needed
 * for a faculty user to discover their own Faculty.id) is
 * SUPER_ADMIN/ORG_ADMIN-only, and GET /mentorships has no server-side
 * auto-scoping by the calling user's own facultyId. A faculty user
 * currently has no backend-supported way to learn "which mentorships
 * are mine." Marked with the same "*" convention as Alumni's
 * Mentorship widget gap — not scheduled against a concrete future
 * milestone, since none currently owns closing this backend gap.
 */
export function StudentProgressWidget() {
  return (
    <WidgetCard
      title="Student Progress"
      icon={Users}
      wired={false}
      milestone="A4*"
      placeholderMessage="No backend-supported way exists yet for faculty to look up their own mentee list (see the A4 milestone notes) — this slot is reserved pending a backend change, not scheduled against a concrete milestone."
    />
  );
}
