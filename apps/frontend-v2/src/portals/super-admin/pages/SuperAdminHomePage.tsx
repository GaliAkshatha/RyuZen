import { Building2, CheckCircle2, PauseCircle, XCircle } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { useOrganizations } from "@/domains/organizations/hooks/useOrganizations";
import { OrganizationStatus } from "@/domains/organizations/organization.types";

/** Real Super Admin home - every count derived from the real Organizations list, nothing invented. */
export function SuperAdminHomePage() {
  const { data: organizations } = useOrganizations();

  const total = organizations?.length ?? 0;
  const active = (organizations ?? []).filter((o) => o.status === OrganizationStatus.ACTIVE).length;
  const suspended = (organizations ?? []).filter((o) => o.status === OrganizationStatus.SUSPENDED).length;
  const inactive = (organizations ?? []).filter((o) => o.status === OrganizationStatus.INACTIVE).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Platform overview</h1>
        <p className="text-sm text-muted-foreground">Every organization registered on RyuZen.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Building2} value={total} label="Organizations" tone="primary" />
        <StatCard icon={CheckCircle2} value={active} label="Active" tone="success" />
        <StatCard icon={PauseCircle} value={inactive} label="Inactive" tone="warning" />
        <StatCard icon={XCircle} value={suspended} label="Suspended" tone="destructive" />
      </div>
    </div>
  );
}
