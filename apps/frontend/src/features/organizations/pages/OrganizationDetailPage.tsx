import { useParams } from "react-router-dom";
import { Building, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useToast } from "@/hooks/useToast";

import { useOrganization } from "@/features/organizations/hooks/useOrganization";
import { useUpdateOrganization } from "@/features/organizations/hooks/useUpdateOrganization";
import { useCreateOrgAdmin } from "@/features/organizations/hooks/useCreateOrgAdmin";
import { OrganizationForm } from "@/features/organizations/components/OrganizationForm";
import { UpdateOrganizationStatusAction } from "@/features/organizations/components/UpdateOrganizationStatusAction";
import { CreateOrgAdminForm } from "@/features/organizations/components/CreateOrgAdminForm";

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: organization, isLoading, isError, error, refetch } = useOrganization(id ?? "");
  const {
    mutate: updateOrganization,
    isPending,
    error: updateError,
  } = useUpdateOrganization(id ?? "");
  const {
    mutate: createOrgAdmin,
    isPending: isCreatingAdmin,
    error: createAdminError,
  } = useCreateOrgAdmin(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !organization) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" aria-hidden="true" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              {organization.name}
            </h1>
            <StatusBadge status={organization.status} />
          </div>
        </div>
        <UpdateOrganizationStatusAction
          organizationId={organization.id}
          currentStatus={organization.status}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 font-body text-sm text-muted-foreground">
          <p>Code: {organization.code}</p>
          <p>Type: {organization.organizationType}</p>
          <p>Plan: {organization.subscriptionPlan}</p>
          <p>Registration method: {organization.registrationMethod}</p>
          <p>Email domains: {organization.emailDomains.join(", ")}</p>
          {organization.website && (
            <a
              href={organization.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-primary underline underline-offset-4"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              {organization.website}
            </a>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            organization={organization}
            isSubmitting={isPending}
            error={updateError}
            onSubmit={(values) =>
              updateOrganization(values, {
                onSuccess: () => toast({ title: "Organization updated" }),
              })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Org Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateOrgAdminForm
            isSubmitting={isCreatingAdmin}
            error={createAdminError}
            onSubmit={(values) =>
              createOrgAdmin(values, { onSuccess: () => toast({ title: "Org admin created" }) })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
