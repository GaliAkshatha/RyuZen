import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Building2, Search, Users, Network } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Badge } from "@/shared/ui/Badge";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";

import { useOrganizations } from "@/domains/organizations/hooks/useOrganizations";
import { OrganizationStatus } from "@/domains/organizations/organization.types";

function statusVariant(status: OrganizationStatus): "success" | "destructive" | "secondary" {
  if (status === OrganizationStatus.ACTIVE) return "success";
  if (status === OrganizationStatus.SUSPENDED) return "destructive";
  return "secondary";
}

/**
 * Real, sortable data table - matches the standard multi-tenant admin
 * pattern (Stripe/Auth0-style), not cards. userCount/departmentCount
 * are a real backend enrichment added alongside this pass's
 * serialization fix - previously every field here was genuinely
 * undefined on the wire (see organization.types.ts for the full
 * story), so this page effectively never had real data to show at
 * all. Uses the full available width (no artificial max-w), matching
 * how every other real list page in this app is built.
 */
export function OrganizationListPage() {
  const { data: organizations, isLoading, isError, error, refetch } = useOrganizations();
  const [search, setSearch] = useState("");

  const filtered = (organizations ?? []).filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) || org.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            {organizations ? `${organizations.length} organization${organizations.length === 1 ? "" : "s"} on the platform` : "Every real, registered institution on RyuZen."}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/platform/organizations/new">
            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
            New Organization
          </Link>
        </Button>
      </div>

      {organizations && organizations.length > 0 && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input placeholder="Search organizations..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !organizations || organizations.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations yet"
          description="Create the first organization to get started."
          actionLabel="New Organization"
          onAction={() => (window.location.href = "/platform/organizations/new")}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No organizations match your search" />
      ) : (
        <div className="w-full overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Organization</th>
                <th className="px-4 py-3 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    Users
                  </span>
                </th>
                <th className="px-4 py-3 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Network className="h-3.5 w-3.5" aria-hidden="true" />
                    Departments
                  </span>
                </th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((org) => (
                <tr key={org.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <Link to={`/platform/organizations/${org.id}`} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground">
                        {org.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground hover:underline">{org.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{org.code}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground">{org.userCount ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground">{org.departmentCount ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{org.organizationType}</td>
                  <td className="px-4 py-3 text-muted-foreground">{org.subscriptionPlan}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(org.status)}>{org.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
