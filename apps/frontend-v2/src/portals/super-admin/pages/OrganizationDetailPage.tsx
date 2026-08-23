import { useState } from "react";
import { useParams } from "react-router-dom";
import { UserPlus, Users, Network } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { StatCard } from "@/shared/components/StatCard";
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
      <Card>
        <CardContent className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
              {organization.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{organization.name}</h1>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">{organization.code}</span>
                <StatusBadge status={organization.status} />
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setAdminDialogOpen(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Add org admin
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} value={organization.userCount ?? "—"} label="Total users" tone="primary" />
        <StatCard icon={Network} value={organization.departmentCount ?? "—"} label="Departments" tone="info" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Controls whether this organization's users can access the platform.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
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
