import { useNavigate } from "react-router-dom";
import { Plus, Building } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useOrganizations } from "@/features/organizations/hooks/useOrganizations";

export function OrganizationListPage() {
  const navigate = useNavigate();
  const { data: organizations, isLoading, isError, error, refetch } = useOrganizations();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Building className="h-6 w-6 text-primary" aria-hidden="true" />
          Organizations
        </h1>
        <Button onClick={() => navigate("/app/admin/organizations/new")}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          New Organization
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-24" />
          ))}
        </div>
      ) : !organizations || organizations.length === 0 ? (
        <EmptyState
          title="No organizations yet"
          description="Create the first organization to get started."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {organizations.map((org) => (
            <Card
              key={org.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/app/admin/organizations/${org.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/app/admin/organizations/${org.id}`);
              }}
            >
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base">{org.name}</CardTitle>
                <StatusBadge status={org.status} />
              </CardHeader>
              <CardContent className="font-body text-sm text-muted-foreground">
                <p>Code: {org.code}</p>
                <p>{org.emailDomains.join(", ")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
