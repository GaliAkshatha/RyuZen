import { Link } from "react-router-dom";
import { Network } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { useFaculty } from "@/features/faculty/hooks/useFaculty";

/**
 * Wired in A1, per the roadmap's explicit Definition of Done: "D1's
 * Department Statistics widget shows real, live counts." Each stat
 * now links to its real dedicated page - a widget showing a number
 * with nowhere to go is a dead end, not a decision aid.
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
          <Link to="/app/admin/departments" className="group">
            <dt className="text-muted-foreground group-hover:text-primary">Departments</dt>
            <dd className="font-display text-xl font-semibold text-foreground group-hover:text-primary">
              {departments?.length ?? 0}
            </dd>
          </Link>
          <Link to="/app/admin/departments" className="group">
            <dt className="text-muted-foreground group-hover:text-primary">With HOD</dt>
            <dd className="font-display text-xl font-semibold text-foreground group-hover:text-primary">
              {departmentsWithHod}
            </dd>
          </Link>
          <Link to="/app/admin/faculty" className="group">
            <dt className="text-muted-foreground group-hover:text-primary">Active Faculty</dt>
            <dd className="font-display text-xl font-semibold text-foreground group-hover:text-primary">
              {activeFaculty}
            </dd>
          </Link>
        </dl>
      )}
    </WidgetCard>
  );
}
