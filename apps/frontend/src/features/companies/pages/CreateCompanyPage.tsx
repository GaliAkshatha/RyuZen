import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useCreateCompany } from "@/features/companies/hooks/useCreateCompany";
import { CompanyForm } from "@/features/companies/components/CompanyForm";
import type { CreateCompanyFormValues } from "@/features/companies/schemas/company.schemas";

export function CreateCompanyPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateCompany();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link
        to="/app/placements/companies"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Companies
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Company</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) =>
              mutate(values as CreateCompanyFormValues, {
                onSuccess: (created) =>
                  navigate(`/app/placements/companies/${created.id}`, { replace: true }),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
