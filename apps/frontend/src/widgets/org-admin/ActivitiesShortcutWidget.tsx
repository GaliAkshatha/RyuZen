import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Replaces D1's ActivityManagementShortcutWidget, which was built
 * before the real Activities backend existed and assumed ORG_ADMIN
 * could manage activities like most other admin resources in this app.
 * AC1 confirmed the opposite: activity.routes.ts gates Create/Update/
 * Publish/Close/Delete to SUPER_ADMIN + FACULTY only, explicitly
 * excluding ORG_ADMIN. This widget is corrected to offer what
 * ORG_ADMIN actually has — browsing, the same GET access every role
 * gets — not a "manage" capability that doesn't exist for this role.
 */
export function ActivitiesShortcutWidget() {
  return (
    <WidgetCard title="Activities" icon={ClipboardList} wired>
      <div className="flex flex-col gap-3">
        <p className="font-body text-sm text-muted-foreground">
          Browse activities across your organization. Creating and publishing activities is done by
          faculty.
        </p>
        <Button asChild size="sm" variant="outline" className="self-start">
          <Link to="/app/activities">Browse Activities</Link>
        </Button>
      </div>
    </WidgetCard>
  );
}
