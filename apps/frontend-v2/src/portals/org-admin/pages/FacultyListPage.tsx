import { Link } from "react-router-dom";
import { Plus, GraduationCap } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useFacultyList } from "@/domains/faculty/hooks/useFacultyList";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";

export function FacultyListPage() {
  const { data: faculty, isLoading, isError, error, refetch } = useFacultyList();
  const { data: departments } = useDepartments();

  const departmentById = new Map((departments ?? []).map((d) => [d.id, d]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Faculty</h1>
          <p className="text-sm text-muted-foreground">Every faculty profile in your organization.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/organization/faculty/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New faculty
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !faculty || faculty.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No faculty yet"
          description="Add a faculty profile for an existing user account to get started."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Employee ID</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <Link to={`/organization/faculty/${f.id}`} className="font-medium text-foreground hover:underline">
                      {f.employeeId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{f.designation}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {f.departmentId ? (departmentById.get(f.departmentId)?.name ?? "Unknown") : "Unassigned"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
