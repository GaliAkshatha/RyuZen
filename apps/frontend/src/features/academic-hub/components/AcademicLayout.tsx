import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ClipboardList, FileCheck, QrCode, CalendarCheck, Code2, GraduationCap } from "lucide-react";

import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

/**
 * "Same for academic section where all the assignments and related
 * falls in one." A plain wrapper component, not a React Router nested
 * layout - Attendance and Assessments each have real, role-divergent
 * sub-routes (create/manage/results/take) scattered elsewhere in the
 * router, and nesting all of that under one parent risked real
 * route-ordering bugs for a cosmetic win. This wraps only the 8 real
 * top-level landing pages with a shared, consistent tab strip -
 * clicking into a specific activity/assessment naturally leaves the
 * hub view, the same way detail pages usually do.
 *
 * Tabs are role-aware: Attendance points to the real path for the
 * current role (Faculty opens sessions, Students view their own
 * record), and Coding Practice only shows for STUDENT, matching its
 * real backend restriction.
 */
export function AcademicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isStudent = user?.role === UserRole.STUDENT;
  const isFaculty = user?.role === UserRole.FACULTY;

  const tabs = [
    { to: "/app/activities", label: "Activities", icon: ClipboardList },
    { to: "/app/submissions", label: "Submissions", icon: FileCheck },
    {
      to: isFaculty ? "/app/attendance/open" : "/app/attendance/me",
      label: "Attendance",
      icon: isFaculty ? QrCode : CalendarCheck,
    },
    { to: "/app/assessments", label: "Assessments", icon: GraduationCap },
    ...(isStudent
      ? [{ to: "/app/coding-profiles", label: "Coding Practice", icon: Code2 }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Academic" className="flex flex-wrap gap-1 border-b border-border pb-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-body text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )
            }
          >
            <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {children}
    </div>
  );
}
