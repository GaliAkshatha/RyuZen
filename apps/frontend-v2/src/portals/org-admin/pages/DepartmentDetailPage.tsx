import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { useDepartment } from "@/domains/departments/hooks/useDepartment";
import { useUpdateDepartment } from "@/domains/departments/hooks/useUpdateDepartment";
import { useAssignHeadOfDepartment } from "@/domains/departments/hooks/useAssignHeadOfDepartment";
import { useDeleteDepartment } from "@/domains/departments/hooks/useDeleteDepartment";

export function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: department, isLoading, isError, error, refetch } = useDepartment(id ?? "");
  const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartment(id ?? "");
  const { mutate: assignHead, isPending: isAssigning } = useAssignHeadOfDepartment(id ?? "");
  const { mutate: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

  const [description, setDescription] = useState<string | null>(null);
  const [headUserId, setHeadUserId] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !department) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const descriptionValue = description ?? department.description ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{department.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">{department.code}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isDeleting}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
          onClick={() => {
            if (window.confirm(`Delete ${department.name}? This cannot be undone.`)) {
              deleteDepartment(department.id, { onSuccess: () => navigate("/organization/departments") });
            }
          }}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input value={descriptionValue} onChange={(e) => setDescription(e.target.value)} placeholder="No description yet" />
          <Button
            size="sm"
            className="w-fit"
            disabled={isUpdating || descriptionValue === (department.description ?? "")}
            onClick={() => updateDepartment({ description: descriptionValue })}
          >
            {isUpdating ? "Saving…" : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Head of Department</CardTitle>
          <CardDescription>
            {department.headOfDepartmentId
              ? `Currently assigned (user id: ${department.headOfDepartmentId}).`
              : "No head of department assigned yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="head-user-id">User ID</Label>
            <Input
              id="head-user-id"
              placeholder="Enter the real user id to assign"
              value={headUserId}
              onChange={(e) => setHeadUserId(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="w-fit"
            disabled={isAssigning || !headUserId.trim()}
            onClick={() =>
              assignHead(
                { userId: headUserId.trim() },
                { onSuccess: () => setHeadUserId("") },
              )
            }
          >
            {isAssigning ? "Assigning…" : "Assign"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
