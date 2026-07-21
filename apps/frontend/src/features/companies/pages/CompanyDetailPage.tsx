import { useParams } from "react-router-dom";
import { Building2, ExternalLink, Mail } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

import { useCompany } from "@/features/companies/hooks/useCompany";
import { useUpdateCompany } from "@/features/companies/hooks/useUpdateCompany";
import { CompanyForm } from "@/features/companies/components/CompanyForm";
import { UpdateCompanyStatusAction } from "@/features/companies/components/UpdateCompanyStatusAction";
import { DeleteCompanyAction } from "@/features/companies/components/DeleteCompanyAction";
import { canManageCompanies } from "@/features/companies/utils/companyPermissions";

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: company, isLoading, isError, error, refetch } = useCompany(id ?? "");
  const { mutate: updateCompany, isPending, error: updateError } = useUpdateCompany(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !company) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const canManage = canManageCompanies(user?.role);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">{company.name}</h1>
            <StatusBadge status={company.status} />
          </div>
        </div>
        {canManage && (
          <div className="flex shrink-0 gap-2">
            <UpdateCompanyStatusAction company={company} />
            <DeleteCompanyAction company={company} />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="font-body text-sm text-foreground">
            {company.description || "No description provided."}
          </p>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-body text-sm text-primary underline underline-offset-4"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              {company.website}
            </a>
          )}
          {(company.hrName || company.hrEmail) && (
            <p className="flex items-center gap-1 font-body text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {company.hrName}
              {company.hrName && company.hrEmail ? " — " : ""}
              {company.hrEmail}
            </p>
          )}
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Company</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyForm
              company={company}
              isSubmitting={isPending}
              error={updateError}
              onSubmit={(values) =>
                updateCompany(values, { onSuccess: () => toast({ title: "Company updated" }) })
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
