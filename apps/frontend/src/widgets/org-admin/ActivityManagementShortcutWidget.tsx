import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function ActivityManagementShortcutWidget() {
  return (
    <WidgetCard title="Activity Management" icon={ClipboardList} wired>
      <div className="flex flex-col gap-3">
        <p className="font-body text-sm text-muted-foreground">
          Create, publish, and manage activities for your organization.
        </p>
        <Button asChild size="sm" variant="outline" className="self-start">
          <Link to="/app/activities">Manage Activities</Link>
        </Button>
      </div>
    </WidgetCard>
  );
}
