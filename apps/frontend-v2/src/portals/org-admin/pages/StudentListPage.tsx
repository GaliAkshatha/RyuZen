import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useStudentList } from "@/domains/students/hooks/useStudentList";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";

export function StudentListPage() {
  const { data: students, isLoading, isError, error, refetch } = useStudentList();
  const { data: departments } = useDepartments();

  const departmentById = new Map((departments ?? []).map((d) => [d.id, d]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">Every student profile in your organization.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/organization/students/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New student
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
      ) : !students || students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="Add a student profile for an existing user account, or use bulk import for many at once."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">USN</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Semester</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">CGPA</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <Link to={`/organization/students/${s.id}`} className="font-medium text-foreground hover:underline">
                      {s.usn}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.batch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.semester}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.departmentId ? (departmentById.get(s.departmentId)?.name ?? "Unknown") : "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.cgpa?.toFixed(2) ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
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
