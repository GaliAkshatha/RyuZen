import { Link } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";

export function CompanyListPage() {
  const { data: companies, isLoading, isError, error, refetch } = useCompanies();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Companies</h1>
          <p className="text-sm text-muted-foreground">Every company you can run drives for.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/placement-admin/companies/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New company
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !companies || companies.length === 0 ? (
        <EmptyState icon={Building2} title="No companies yet" description="Add the first company to run a drive for." />
      ) : (
        <div className="flex flex-col gap-2">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">{company.name}</p>
                  {company.hrName && (
                    <p className="text-xs text-muted-foreground">
                      {company.hrName}
                      {company.hrEmail && ` · ${company.hrEmail}`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
