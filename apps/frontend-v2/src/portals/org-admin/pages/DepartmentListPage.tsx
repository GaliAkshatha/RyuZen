import { Link } from "react-router-dom";
import { Plus, Network } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";

export function DepartmentListPage() {
  const { data: departments, isLoading, isError, error, refetch } = useDepartments();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
          <p className="text-sm text-muted-foreground">Every academic department in your organization.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/organization/departments/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New department
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
      ) : !departments || departments.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No departments yet"
          description="Create the first department to organize your faculty and students."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Head of Department</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <Link to={`/organization/departments/${dept.id}`} className="font-medium text-foreground hover:underline">
                      {dept.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{dept.code}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dept.headOfDepartmentId ? "Assigned" : "Not assigned"}
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
