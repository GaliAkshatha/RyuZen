import { Building2, Globe, Mail } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { useMyRecruiterProfile } from "@/domains/recruiters/hooks/useMyRecruiterProfile";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";

/**
 * Closes a previously-confirmed backend gap: there was no
 * GET /recruiters/me self-lookup, so a recruiter's own real companyId
 * could only be approximated from their applicant data (incomplete -
 * a company with zero applicants yet would never show up). Now real,
 * via the same genuine self-lookup pattern already proven for Faculty.
 */
export function MyCompanyPage() {
  const { data: profile, isLoading: isLoadingProfile, isError, error, refetch } = useMyRecruiterProfile();
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();

  if (isLoadingProfile || isLoadingCompanies) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !profile) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const company = companies?.find((c) => c.id === profile.companyId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Company</h1>
        {profile.jobTitle && <p className="text-sm text-muted-foreground">{profile.jobTitle}</p>}
      </div>

      {!company ? (
        <ErrorState message="Your company's details couldn't be loaded." onRetry={() => refetch()} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              {company.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {company.description && <p className="text-sm text-foreground">{company.description}</p>}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-1.5 text-sm text-primary underline underline-offset-4"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                {company.website}
              </a>
            )}
            {company.hrEmail && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {company.hrName ? `${company.hrName} · ` : ""}
                {company.hrEmail}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
