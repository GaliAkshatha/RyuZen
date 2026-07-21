import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDepartment } from "@/features/departments/hooks/useDepartment";
import { useUpdateDepartment } from "@/features/departments/hooks/useUpdateDepartment";
import { useDeleteDepartment } from "@/features/departments/hooks/useDeleteDepartment";
import { useAssignHod } from "@/features/departments/hooks/useAssignHod";
import { DepartmentForm } from "@/features/departments/components/DepartmentForm";
import { AssignHodForm } from "@/features/departments/components/AssignHodForm";

import { useFaculty } from "@/features/faculty/hooks/useFaculty";
import { facultyLabel, resolveFacultyByUserId } from "@/features/faculty/utils/facultyLabels";

export function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: department, isLoading, isError, error, refetch } = useDepartment(id ?? "");
  const { data: facultyList } = useFaculty();
  const {
    mutate: updateDepartment,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateDepartment(id ?? "");
  const { mutate: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();
  const { mutate: assignHod, isPending: isAssigning, error: assignError } = useAssignHod(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !department) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const currentHod = resolveFacultyByUserId(facultyList, department.headOfDepartmentId);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">{department.name}</h1>
          <p className="font-mono text-sm text-muted-foreground">{department.code}</p>
        </div>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          Delete
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Department</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentForm
            department={department}
            isSubmitting={isUpdating}
            error={updateError}
            onSubmit={(values) =>
              updateDepartment(values, { onSuccess: () => toast({ title: "Department updated" }) })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Head of Department</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="font-body text-sm text-muted-foreground">
            {currentHod
              ? `Currently: ${facultyLabel(currentHod)}`
              : "No head of department assigned."}
          </p>
          <AssignHodForm
            facultyOptions={facultyList ?? []}
            currentHeadUserId={department.headOfDepartmentId}
            isSubmitting={isAssigning}
            error={assignError}
            onSubmit={(values) =>
              assignHod(values, {
                onSuccess: () => toast({ title: "Head of department assigned" }),
              })
            }
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this department?"
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={() =>
          deleteDepartment(department.id, {
            onSuccess: () => {
              toast({ title: "Department deleted" });
              navigate("/app/admin/departments");
            },
          })
        }
      />
    </div>
  );
}
