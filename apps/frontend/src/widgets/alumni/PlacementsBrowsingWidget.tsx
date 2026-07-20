import { Briefcase } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Distinct from Student's MyApplicationsWidget — F5's backend research
 * found Job Applications' apply/list-mine endpoints are STUDENT-only.
 * Alumni can browse placement drives (open to all roles) but not
 * apply, so this widget wires to PL2 (Placement Drives, browse-only),
 * not PL3 (Job Applications).
 */
export function PlacementsBrowsingWidget() {
  return (
    <WidgetCard
      title="Placements"
      icon={Briefcase}
      wired={false}
      milestone="PL2"
      placeholderMessage="Open placement drives will appear here for browsing. Note: applying is a student-only action on the current backend."
    />
  );
}
