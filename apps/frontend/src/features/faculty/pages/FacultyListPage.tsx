import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/Dialog";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useToast } from "@/hooks/useToast";

import { useFaculty } from "@/features/faculty/hooks/useFaculty";
import { useCreateFaculty } from "@/features/faculty/hooks/useCreateFaculty";
import { FacultyForm } from "@/features/faculty/components/FacultyForm";
import type { FacultyResponseDto } from "@/features/faculty/types/faculty.types";

import { useDepartments } from "@/features/departments/hooks/useDepartments";

export function FacultyListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: faculty, isLoading, isError, error, refetch } = useFaculty();
  const { data: departments } = useDepartments();
  const { mutate: createFaculty, isPending, error: createError } = useCreateFaculty();
  const [createOpen, setCreateOpen] = useState(false);

  const departmentNameById = new Map((departments ?? []).map((d) => [d.id, d.name]));

  const columns: DataGridColumn<FacultyResponseDto>[] = [
    {
      key: "employeeId",
      header: "Employee ID",
      render: (f) => f.employeeId,
      sortable: true,
      sortValue: (f) => f.employeeId,
    },
    {
      key: "designation",
      header: "Designation",
      render: (f) => f.designation,
      sortable: true,
      sortValue: (f) => f.designation,
    },
    {
      key: "department",
      header: "Department",
      render: (f) => (f.departmentId ? (departmentNameById.get(f.departmentId) ?? "Unknown") : "—"),
    },
    { key: "status", header: "Status", render: (f) => <StatusBadge status={f.status} /> },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Faculty</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          New Faculty Record
        </Button>
      </div>

      <DataGrid
        data={faculty ?? []}
        columns={columns}
        getRowId={(f) => f.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search faculty…"
        getSearchableText={(f) => `${f.employeeId} ${f.designation} ${f.specialization ?? ""}`}
        emptyTitle="No faculty records yet"
        emptyDescription="Create your first faculty record to get started."
        onRowClick={(f) => navigate(`/app/admin/faculty/${f.id}`)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Faculty Record</DialogTitle>
          </DialogHeader>
          <FacultyForm
            departments={departments ?? []}
            isSubmitting={isPending}
            error={createError}
            onSubmit={(values) =>
              createFaculty(
                values as {
                  userId: string;
                  departmentId?: string;
                  employeeId: string;
                  designation: string;
                  specialization?: string;
                },
                {
                  onSuccess: () => {
                    toast({ title: "Faculty record created" });
                    setCreateOpen(false);
                  },
                },
              )
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
