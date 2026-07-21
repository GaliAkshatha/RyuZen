import { Link } from "react-router-dom";
import { Building } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { OrganizationStatus } from "@/types/enums";

import { useOrganizations } from "@/features/organizations/hooks/useOrganizations";

/** Wired in AD2. */
export function TenantManagementWidget() {
  const { data: organizations, isLoading } = useOrganizations();

  const total = organizations?.length ?? 0;
  const active = organizations?.filter((o) => o.status === OrganizationStatus.ACTIVE).length ?? 0;

  return (
    <WidgetCard title="Organizations" icon={Building} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3 font-body text-sm">
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-display text-lg font-semibold text-foreground">{total}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Active</p>
              <p className="font-display text-lg font-semibold text-foreground">{active}</p>
            </div>
          </div>
          <Link
            to="/app/admin/organizations"
            className="font-body text-xs text-primary underline underline-offset-4"
          >
            Manage organizations
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
