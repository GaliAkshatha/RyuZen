import { Link } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
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

export function OrganizationListPage() {
  const { data: organizations, isLoading, isError, error, refetch } = useOrganizations();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Organizations</h1>
          <p className="text-sm text-muted-foreground">Every real, registered institution on RyuZen.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/platform/organizations/new">
            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
            New Organization
          </Link>
        </Button>
      </div>

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
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <Link to={`/platform/organizations/${org.id}`} className="font-medium text-foreground hover:underline">
                      {org.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{org.code}</td>
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
