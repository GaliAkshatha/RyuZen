import { Network } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { useFaculty } from "@/features/faculty/hooks/useFaculty";

/**
 * Wired in A1, per the roadmap's explicit Definition of Done: "D1's
 * Department Statistics widget shows real, live counts."
 */
export function DepartmentStatisticsWidget() {
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: faculty, isLoading: isLoadingFaculty } = useFaculty();

  const isLoading = isLoadingDepartments || isLoadingFaculty;

  const departmentsWithHod = (departments ?? []).filter((d) => d.headOfDepartmentId).length;
  const activeFaculty = (faculty ?? []).filter((f) => f.status === "ACTIVE").length;

  return (
    <WidgetCard title="Department Statistics" icon={Network} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <dl className="grid grid-cols-3 gap-3 font-body text-sm">
          <div>
            <dt className="text-muted-foreground">Departments</dt>
            <dd className="font-display text-xl font-semibold text-foreground">
              {departments?.length ?? 0}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">With HOD</dt>
            <dd className="font-display text-xl font-semibold text-foreground">
              {departmentsWithHod}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Active Faculty</dt>
            <dd className="font-display text-xl font-semibold text-foreground">{activeFaculty}</dd>
          </div>
        </dl>
      )}
    </WidgetCard>
  );
}
