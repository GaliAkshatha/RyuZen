import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";

import { useAlumniList } from "@/features/alumni/hooks/useAlumniList";
import type { AlumniResponseDto } from "@/features/alumni/types/alumni.types";

const columns: DataGridColumn<AlumniResponseDto>[] = [
  {
    key: "email",
    header: "Email",
    render: (a) => a.email,
    sortable: true,
    sortValue: (a) => a.email,
  },
  { key: "name", header: "Name", render: (a) => a.name ?? "—" },
  { key: "company", header: "Company", render: (a) => a.company ?? "—" },
  { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
  {
    key: "verified",
    header: "Verified",
    render: (a) =>
      a.isVerified ? (
        <Badge variant="success">Verified</Badge>
      ) : (
        <Badge variant="secondary">Unverified</Badge>
      ),
  },
];

export function AlumniListPage() {
  const navigate = useNavigate();
  const { data: alumni, isLoading, isError, error, refetch } = useAlumniList();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Alumni</h1>
        <Button onClick={() => navigate("/app/admin/alumni/invite")}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Invite Alumnus
        </Button>
      </div>

      <DataGrid
        data={alumni ?? []}
        columns={columns}
        getRowId={(a) => a.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search alumni…"
        getSearchableText={(a) => `${a.email} ${a.name ?? ""} ${a.company ?? ""}`}
        emptyTitle="No alumni yet"
        emptyDescription="Invite your first alumnus to get started."
        onRowClick={(a) => navigate(`/app/admin/alumni/${a.id}`)}
      />
    </div>
  );
}
