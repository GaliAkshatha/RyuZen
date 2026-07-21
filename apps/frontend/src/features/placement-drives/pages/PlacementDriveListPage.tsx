import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Briefcase } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";

import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";
import { canManagePlacementDrives } from "@/features/placement-drives/utils/placementDrivePermissions";

import { useCompanies } from "@/features/companies/hooks/useCompanies";

export function PlacementDriveListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: drives, isLoading, isError, error, refetch } = usePlacementDrives();
  const { data: companies } = useCompanies();
  const [search, setSearch] = useState("");

  const companyNameById = new Map((companies ?? []).map((c) => [c.id, c.name]));
  const filtered = (drives ?? []).filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Briefcase className="h-6 w-6 text-primary" aria-hidden="true" />
          Placement Drives
        </h1>
        {canManagePlacementDrives(user?.role) && (
          <Button onClick={() => navigate("/app/placements/drives/new")}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Drive
          </Button>
        )}
      </div>

      <Input
        placeholder="Search drives…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-28" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No placement drives yet"
          description={
            canManagePlacementDrives(user?.role)
              ? "Create your first placement drive to get started."
              : "No placement drives are available right now."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((drive) => (
            <Card
              key={drive.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/app/placements/drives/${drive.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/app/placements/drives/${drive.id}`);
              }}
            >
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base">{drive.title}</CardTitle>
                <StatusBadge status={drive.status} />
              </CardHeader>
              <CardContent className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
                <span>{companyNameById.get(drive.companyId) ?? drive.companyId}</span>
                {drive.package && <span>{drive.package}</span>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
