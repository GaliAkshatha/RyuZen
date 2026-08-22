import { useState } from "react";
import { useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useOrganization } from "@/domains/organizations/hooks/useOrganization";
import { useUpdateOrganizationStatus } from "@/domains/organizations/hooks/useUpdateOrganizationStatus";
import { OrganizationStatus } from "@/domains/organizations/organization.types";
import { CreateOrgAdminDialog } from "@/domains/organizations/components/CreateOrgAdminDialog";

const STATUS_OPTIONS = Object.values(OrganizationStatus);

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: organization, isLoading, isError, error, refetch } = useOrganization(id ?? "");
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrganizationStatus(id ?? "");
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div>
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{organization.name}</h1>
          <p className="text-sm text-muted-foreground">{organization.code}</p>
        </div>
        <Button size="sm" onClick={() => setAdminDialogOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Add org admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Controls whether this organization's users can access the platform.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <StatusBadge status={organization.status} />
          {STATUS_OPTIONS.filter((s) => s !== organization.status).map((status) => (
            <Button
              key={status}
              size="sm"
              variant="outline"
              disabled={isUpdatingStatus}
              onClick={() => updateStatus({ status })}
            >
              Set {status.toLowerCase()}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Email domains</p>
            <p className="text-sm text-foreground">{organization.emailDomains.join(", ")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Organization type</p>
            <p className="text-sm text-foreground">{organization.organizationType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Subscription plan</p>
            <p className="text-sm text-foreground">{organization.subscriptionPlan}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Registration method</p>
            <p className="text-sm text-foreground">{organization.registrationMethod}</p>
          </div>
        </CardContent>
      </Card>

      <CreateOrgAdminDialog
        organizationId={organization.id}
        open={adminDialogOpen}
        onOpenChange={setAdminDialogOpen}
      />
    </div>
  );
}
