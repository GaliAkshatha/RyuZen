import { Link } from "react-router-dom";
import { UserCog } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function UserManagementShortcutWidget() {
  return (
    <WidgetCard title="User Management" icon={UserCog} wired>
      <div className="flex flex-col gap-3">
        <p className="font-body text-sm text-muted-foreground">
          Manage user accounts and permissions for your organization.
        </p>
        <Button asChild size="sm" variant="outline" className="self-start">
          <Link to="/app/admin/users">Manage Users</Link>
        </Button>
      </div>
    </WidgetCard>
  );
}
