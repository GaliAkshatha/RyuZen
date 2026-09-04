import { useState } from "react";
import { useParams } from "react-router-dom";
import { UserX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useFacultyMember } from "@/domains/faculty/hooks/useFacultyMember";
import { useUpdateFaculty } from "@/domains/faculty/hooks/useUpdateFaculty";
import { useAssignFacultyDepartment } from "@/domains/faculty/hooks/useAssignFacultyDepartment";
import { useDeactivateFaculty } from "@/domains/faculty/hooks/useDeactivateFaculty";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import { FacultyStatus } from "@/domains/faculty/faculty.types";
import { AccountAccessCard } from "@/domains/user-admin/components/AccountAccessCard";

export function FacultyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: faculty, isLoading, isError, error, refetch } = useFacultyMember(id ?? "");
  const { data: departments } = useDepartments();
  const { mutate: updateFaculty, isPending: isUpdating } = useUpdateFaculty(id ?? "");
  const { mutate: assignDepartment, isPending: isAssigning } = useAssignFacultyDepartment(id ?? "");
  const { mutate: deactivateFaculty, isPending: isDeactivating } = useDeactivateFaculty();

  const [designation, setDesignation] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !faculty) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const designationValue = designation ?? faculty.designation;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{faculty.employeeId}</h1>
          <p className="text-sm text-muted-foreground">{faculty.specialization ?? "No specialization listed"}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={faculty.status} />
          {faculty.status === FacultyStatus.ACTIVE && (
            <Button
              variant="outline"
              size="sm"
              disabled={isDeactivating}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
              onClick={() => {
                if (window.confirm(`Deactivate ${faculty.employeeId}? They will lose access.`)) {
                  deactivateFaculty(faculty.id);
                }
              }}
            >
              <UserX className="h-4 w-4" aria-hidden="true" />
              Deactivate
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Designation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input value={designationValue} onChange={(e) => setDesignation(e.target.value)} />
          <Button
            size="sm"
            className="w-fit"
            disabled={isUpdating || designationValue === faculty.designation}
            onClick={() => updateFaculty({ designation: designationValue })}
          >
            {isUpdating ? "Saving…" : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Label htmlFor="faculty-department" className="sr-only">
            Department
          </Label>
          <Select
            value={faculty.departmentId}
            onValueChange={(departmentId) => assignDepartment({ departmentId })}
            disabled={isAssigning}
          >
            <SelectTrigger id="faculty-department" className="max-w-xs">
              <SelectValue placeholder="No department assigned" />
            </SelectTrigger>
            <SelectContent>
              {(departments ?? []).map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <AccountAccessCard
        userId={faculty.userId}
        recordQueryKey={["faculty", id]}
        userStatus={faculty.userStatus}
        permissions={faculty.permissions}
      />
    </div>
  );
}
