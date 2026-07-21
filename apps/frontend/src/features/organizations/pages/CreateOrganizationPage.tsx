import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useCreateOrganization } from "@/features/organizations/hooks/useCreateOrganization";
import { OrganizationForm } from "@/features/organizations/components/OrganizationForm";
import type { CreateOrganizationFormValues } from "@/features/organizations/schemas/organization.schemas";

export function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateOrganization();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link
        to="/app/admin/organizations"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Organizations
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) =>
              mutate(values as CreateOrganizationFormValues, {
                onSuccess: (created) =>
                  navigate(`/app/admin/organizations/${created.id}`, { replace: true }),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
