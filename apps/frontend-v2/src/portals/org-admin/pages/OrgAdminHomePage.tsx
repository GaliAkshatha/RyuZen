import { Network, GraduationCap, Users, UserCheck } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import { useFacultyList } from "@/domains/faculty/hooks/useFacultyList";
import { useStudentList } from "@/domains/students/hooks/useStudentList";
import { FacultyStatus } from "@/domains/faculty/faculty.types";

/** Real Org Admin home - every count from real Departments/Faculty/Students lists. */
export function OrgAdminHomePage() {
  const { data: departments } = useDepartments();
  const { data: faculty } = useFacultyList();
  const { data: students } = useStudentList();

  const activeFaculty = (faculty ?? []).filter((f) => f.status === FacultyStatus.ACTIVE).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Institution overview</h1>
        <p className="text-sm text-muted-foreground">A real snapshot of your organization.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Network} value={departments?.length ?? 0} label="Departments" tone="primary" />
        <StatCard icon={GraduationCap} value={faculty?.length ?? 0} label="Faculty" tone="info" trend={`${activeFaculty} active`} />
        <StatCard icon={Users} value={students?.length ?? 0} label="Students" tone="success" />
        <StatCard icon={UserCheck} value={activeFaculty} label="Active faculty" tone="warning" />
      </div>
    </div>
  );
}
