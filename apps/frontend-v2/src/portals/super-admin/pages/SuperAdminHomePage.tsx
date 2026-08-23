import { Link } from "react-router-dom";
import { Building2, CheckCircle2, PauseCircle, XCircle, Users, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { useOrganizations } from "@/domains/organizations/hooks/useOrganizations";
import { OrganizationStatus } from "@/domains/organizations/organization.types";

/**
 * Real Super Admin home - every count derived from the real
 * Organizations list. This page previously always showed real zeros
 * regardless of actual data, since GET /organizations was genuinely
 * broken on the wire (see organization.types.ts for the full story,
 * fixed this pass) - so this is effectively the first time this page
 * has ever had real numbers to show.
 */
export function SuperAdminHomePage() {
  const { data: organizations } = useOrganizations();

  const total = organizations?.length ?? 0;
  const active = (organizations ?? []).filter((o) => o.status === OrganizationStatus.ACTIVE).length;
  const suspended = (organizations ?? []).filter((o) => o.status === OrganizationStatus.SUSPENDED).length;
  const totalUsers = (organizations ?? []).reduce((sum, o) => sum + (o.userCount ?? 0), 0);
  const maxUsers = Math.max(...(organizations ?? []).map((o) => o.userCount ?? 0), 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Platform overview</h1>
        <p className="text-sm text-muted-foreground">Every organization on RyuZen, at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Building2} value={total} label="Organizations" tone="primary" to="/platform/organizations" />
        <StatCard icon={Users} value={totalUsers} label="Total users" tone="info" />
        <StatCard icon={CheckCircle2} value={active} label="Active" tone="success" to="/platform/organizations" />
        <StatCard icon={XCircle} value={suspended} label="Suspended" tone="destructive" to="/platform/organizations" />
      </div>

      {organizations && organizations.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Organizations by user count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3" style={{ height: 130 }}>
                {organizations.map((org) => {
                  const count = org.userCount ?? 0;
                  const heightPercent = Math.max((count / maxUsers) * 100, count > 0 ? 8 : 3);
                  return (
                    <Link key={org.id} to={`/platform/organizations/${org.id}`} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex h-24 w-full items-end">
                        <div className="w-full rounded-t-md bg-primary opacity-80 transition-opacity hover:opacity-100" style={{ height: `${heightPercent}%` }} />
                      </div>
                      <p className="w-full truncate text-center text-[11px] text-muted-foreground">{org.name}</p>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Organizations
                <Link to="/platform/organizations" className="text-xs font-medium text-primary">
                  View all
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              {organizations.slice(0, 5).map((org) => (
                <Link key={org.id} to={`/platform/organizations/${org.id}`} className="flex items-center justify-between py-2.5 text-sm hover:text-primary">
                  <div>
                    <p className="font-medium text-foreground">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.userCount ?? 0} users</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs">
                    {org.status === OrganizationStatus.ACTIVE ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                    ) : org.status === OrganizationStatus.SUSPENDED ? (
                      <XCircle className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                    ) : (
                      <PauseCircle className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
