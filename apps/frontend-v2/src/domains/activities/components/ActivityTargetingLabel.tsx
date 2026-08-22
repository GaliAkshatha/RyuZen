import { Users } from "lucide-react";

import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import type { Activity } from "@/domains/activities/activity.types";

/**
 * Real, honest summary of who an activity is actually restricted to -
 * built from the activity's own real departmentIds/batches/semesters/
 * sections fields, the same ones SubmissionEligibilityService
 * genuinely enforces. Resolves department IDs to real names via the
 * already-real useDepartments() hook rather than showing raw IDs.
 */
export function ActivityTargetingLabel({ activity }: { activity: Activity }) {
  const { data: departments } = useDepartments();

  const parts: string[] = [];

  if (activity.departmentIds && activity.departmentIds.length > 0) {
    const names = activity.departmentIds.map(
      (id) => departments?.find((d) => d.id === id)?.name ?? id,
    );
    parts.push(names.join(", "));
  }

  if (activity.batches && activity.batches.length > 0) {
    parts.push(activity.batches.join(", "));
  }

  if (activity.semesters && activity.semesters.length > 0) {
    parts.push(`Sem ${activity.semesters.join(", ")}`);
  }

  if (activity.sections && activity.sections.length > 0) {
    parts.push(`Sec ${activity.sections.join(", ")}`);
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {parts.length > 0 ? parts.join(" · ") : "All students"}
    </span>
  );
}
