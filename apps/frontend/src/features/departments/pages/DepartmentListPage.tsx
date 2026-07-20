import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/Dialog";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { useToast } from "@/hooks/useToast";

import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { useCreateDepartment } from "@/features/departments/hooks/useCreateDepartment";
import { DepartmentForm } from "@/features/departments/components/DepartmentForm";
import type { DepartmentResponseDto } from "@/features/departments/types/department.types";

const columns: DataGridColumn<DepartmentResponseDto>[] = [
  { key: "name", header: "Name", render: (d) => d.name, sortable: true, sortValue: (d) => d.name },
  { key: "code", header: "Code", render: (d) => d.code, sortable: true, sortValue: (d) => d.code },
  {
    key: "hod",
    header: "Head of Department",
    render: (d) => (d.headOfDepartmentId ? "Assigned" : "Unassigned"),
  },
];

export function DepartmentListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: departments, isLoading, isError, error, refetch } = useDepartments();
  const { mutate: createDepartment, isPending, error: createError } = useCreateDepartment();
  const [createOpen, setCreateOpen] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Departments</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          New Department
        </Button>
      </div>

      <DataGrid
        data={departments ?? []}
        columns={columns}
        getRowId={(d) => d.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search departments…"
        getSearchableText={(d) => `${d.name} ${d.code}`}
        emptyTitle="No departments yet"
        emptyDescription="Create your first department to get started."
        onRowClick={(d) => navigate(`/app/admin/departments/${d.id}`)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Department</DialogTitle>
          </DialogHeader>
          <DepartmentForm
            isSubmitting={isPending}
            error={createError}
            onSubmit={(values) =>
              createDepartment(values as { name: string; code: string; description?: string }, {
                onSuccess: () => {
                  toast({ title: "Department created" });
                  setCreateOpen(false);
                },
              })
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
