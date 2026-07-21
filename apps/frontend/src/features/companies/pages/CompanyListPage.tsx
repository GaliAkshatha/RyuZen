import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";

import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { canManageCompanies } from "@/features/companies/utils/companyPermissions";

export function CompanyListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: companies, isLoading, isError, error, refetch } = useCompanies();
  const [search, setSearch] = useState("");

  const filtered = (companies ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
          Companies
        </h1>
        {canManageCompanies(user?.role) && (
          <Button onClick={() => navigate("/app/placements/companies/new")}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Company
          </Button>
        )}
      </div>

      <Input
        placeholder="Search companies…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No companies yet"
          description={
            canManageCompanies(user?.role)
              ? "Add your first recruiting company to get started."
              : "No companies are available right now."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => (
            <Card
              key={company.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/app/placements/companies/${company.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/app/placements/companies/${company.id}`);
              }}
            >
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base">{company.name}</CardTitle>
                <StatusBadge status={company.status} />
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 font-body text-sm text-muted-foreground">
                  {company.description || "No description provided."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
