import { useState } from "react";
import { useParams } from "react-router-dom";
import { UserX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useFacultyMember } from "@/features/faculty/hooks/useFacultyMember";
import { useUpdateFaculty } from "@/features/faculty/hooks/useUpdateFaculty";
import { useAssignFacultyDepartment } from "@/features/faculty/hooks/useAssignFacultyDepartment";
import { useDeactivateFaculty } from "@/features/faculty/hooks/useDeactivateFaculty";
import { FacultyForm } from "@/features/faculty/components/FacultyForm";
import { AssignDepartmentForm } from "@/features/faculty/components/AssignDepartmentForm";
import { facultyLabel } from "@/features/faculty/utils/facultyLabels";

import { useDepartments } from "@/features/departments/hooks/useDepartments";

export function FacultyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const { data: faculty, isLoading, isError, error, refetch } = useFacultyMember(id ?? "");
  const { data: departments } = useDepartments();
  const {
    mutate: updateFaculty,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateFaculty(id ?? "");
  const {
    mutate: assignDepartment,
    isPending: isAssigning,
    error: assignError,
  } = useAssignFacultyDepartment(id ?? "");
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateFaculty(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !faculty) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {facultyLabel(faculty)}
          </h1>
          <StatusBadge status={faculty.status} className="mt-1" />
        </div>
        {faculty.status === "ACTIVE" && (
          <Button variant="destructive" onClick={() => setDeactivateOpen(true)}>
            <UserX className="mr-2 h-4 w-4" aria-hidden="true" />
            Deactivate
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Faculty Record</CardTitle>
        </CardHeader>
        <CardContent>
          <FacultyForm
            faculty={faculty}
            departments={departments ?? []}
            isSubmitting={isUpdating}
            error={updateError}
            onSubmit={(values) =>
              updateFaculty(values, { onSuccess: () => toast({ title: "Faculty record updated" }) })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignDepartmentForm
            departments={departments ?? []}
            currentDepartmentId={faculty.departmentId}
            isSubmitting={isAssigning}
            error={assignError}
            onSubmit={(values) =>
              assignDepartment(values, { onSuccess: () => toast({ title: "Department assigned" }) })
            }
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate this faculty member?"
        description="They will no longer be able to access faculty-only features."
        destructive
        confirmLabel="Deactivate"
        isConfirming={isDeactivating}
        onConfirm={() =>
          deactivate(undefined, {
            onSuccess: () => {
              toast({ title: "Faculty member deactivated" });
              setDeactivateOpen(false);
            },
          })
        }
      />
    </div>
  );
}
