import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/Dialog";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useToast } from "@/hooks/useToast";

import { useStudents } from "@/features/students/hooks/useStudents";
import { useCreateStudent } from "@/features/students/hooks/useCreateStudent";
import { StudentForm } from "@/features/students/components/StudentForm";
import type { StudentResponseDto } from "@/features/students/types/student.types";

import { useDepartments } from "@/features/departments/hooks/useDepartments";

export function StudentListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: students, isLoading, isError, error, refetch } = useStudents();
  const { data: departments } = useDepartments();
  const { mutate: createStudent, isPending, error: createError } = useCreateStudent();
  const [createOpen, setCreateOpen] = useState(false);

  const departmentNameById = new Map((departments ?? []).map((d) => [d.id, d.name]));

  const columns: DataGridColumn<StudentResponseDto>[] = [
    { key: "usn", header: "USN", render: (s) => s.usn, sortable: true, sortValue: (s) => s.usn },
    {
      key: "batch",
      header: "Batch",
      render: (s) => s.batch,
      sortable: true,
      sortValue: (s) => s.batch,
    },
    {
      key: "semester",
      header: "Semester",
      render: (s) => s.semester,
      sortable: true,
      sortValue: (s) => s.semester,
    },
    {
      key: "department",
      header: "Department",
      render: (s) => (s.departmentId ? (departmentNameById.get(s.departmentId) ?? "Unknown") : "—"),
    },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Students</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          New Student
        </Button>
      </div>

      <DataGrid
        data={students ?? []}
        columns={columns}
        getRowId={(s) => s.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search students…"
        getSearchableText={(s) => `${s.usn} ${s.batch}`}
        emptyTitle="No students yet"
        emptyDescription="Create your first student record to get started."
        onRowClick={(s) => navigate(`/app/admin/students/${s.id}`)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Student</DialogTitle>
          </DialogHeader>
          <StudentForm
            departments={departments ?? []}
            isSubmitting={isPending}
            error={createError}
            onSubmit={(values) =>
              createStudent(
                values as {
                  userId: string;
                  departmentId?: string;
                  usn: string;
                  batch: string;
                  semester?: number;
                  cgpa?: number;
                },
                {
                  onSuccess: () => {
                    toast({ title: "Student created" });
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
