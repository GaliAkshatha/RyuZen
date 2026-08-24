import { Link } from "react-router-dom";
import { Network, GraduationCap, Users, UserCheck, ClipboardCheck, Mail, UserCog, ChevronRight, UserPlus, FolderPlus, BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { ScoreRing } from "@/shared/components/ScoreRing";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import { useFacultyList } from "@/domains/faculty/hooks/useFacultyList";
import { useStudentList } from "@/domains/students/hooks/useStudentList";
import { useOrgDashboard } from "@/domains/org-dashboard/hooks/useOrgDashboard";
import { useInvitations } from "@/domains/invitations/hooks/useInvitations";
import { useAlumniList } from "@/domains/alumni-management/hooks/useAlumniList";
import { FacultyStatus } from "@/domains/faculty/faculty.types";
import { InvitationStatus } from "@/domains/invitations/invitation.types";
import { AlumniStatus } from "@/domains/alumni-management/alumniManagement.types";

/**
 * Real Org Admin home - previously just a header and 4 stat cards,
 * despite the real /dashboard endpoint (already wired for the
 * separate Analytics page) carrying genuinely rich data - engagement,
 * XP, department comparison - none of which ever reached the first
 * page an admin actually sees after logging in. This surfaces a real
 * summary of that same data here, plus a genuine "needs your
 * attention" list built from real pending counts across three
 * domains (activity reviews, invitations, alumni verification) -
 * only ever showing an item when its count is actually > 0, not
 * padding the list with empty rows.
 */
export function OrgAdminHomePage() {
  const { data: departments } = useDepartments();
  const { data: faculty } = useFacultyList();
  const { data: students } = useStudentList();
  const { data: dashboard } = useOrgDashboard();
  const { data: invitations } = useInvitations();
  const { data: alumni } = useAlumniList();

  const activeFaculty = (faculty ?? []).filter((f) => f.status === FacultyStatus.ACTIVE).length;
  const pendingInvitations = (invitations ?? []).filter((i) => i.status === InvitationStatus.PENDING).length;
  const pendingAlumni = (alumni ?? []).filter((a) => a.status === AlumniStatus.INVITED).length;
  const pendingReviews = dashboard?.activities.pendingReviews ?? 0;

  const attentionItems = [
    pendingReviews > 0 && { icon: ClipboardCheck, label: `${pendingReviews} activity submission${pendingReviews === 1 ? "" : "s"} awaiting review`, to: "/organization/faculty", tone: "warning" as const },
    pendingInvitations > 0 && { icon: Mail, label: `${pendingInvitations} invitation${pendingInvitations === 1 ? "" : "s"} still pending`, to: "/organization/invitations", tone: "info" as const },
    pendingAlumni > 0 && { icon: UserCog, label: `${pendingAlumni} alumni invited, not yet active`, to: "/organization/alumni", tone: "info" as const },
  ].filter((x): x is { icon: typeof ClipboardCheck; label: string; to: string; tone: "warning" | "info" } => Boolean(x));

  const topDepartments = [...(dashboard?.departmentComparison ?? [])].sort((a, b) => b.averagePoints - a.averagePoints).slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Institution overview</h1>
        <p className="text-sm text-muted-foreground">A real snapshot of your organization.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Network} value={departments?.length ?? 0} label="Departments" tone="primary" to="/organization/departments" />
        <StatCard icon={GraduationCap} value={faculty?.length ?? 0} label="Faculty" tone="info" trend={`${activeFaculty} active`} to="/organization/faculty" />
        <StatCard icon={Users} value={students?.length ?? 0} label="Students" tone="success" to="/organization/students" />
        <StatCard icon={UserCheck} value={activeFaculty} label="Active faculty" tone="warning" to="/organization/faculty" />
      </div>

      {attentionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Needs your attention</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {attentionItems.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center justify-between py-2.5 text-sm hover:text-primary">
                <span className="flex items-center gap-2.5">
                  <item.icon className={`h-4 w-4 ${item.tone === "warning" ? "text-warning" : "text-info"}`} aria-hidden="true" />
                  {item.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {dashboard && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Student engagement</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 py-2">
              <ScoreRing value={dashboard.studentEngagementPercent} size={130} />
              <p className="text-xs text-muted-foreground">{dashboard.activeStudents} active in last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real activity, this term</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard icon={BarChart3} value={dashboard.xpEarned} label="Total XP earned" tone="primary" />
              <StatCard icon={ClipboardCheck} value={dashboard.activitiesCompleted} label="Activities completed" tone="success" />
              <StatCard icon={UserCheck} value={dashboard.certificatesEarned} label="Certificates issued" tone="info" />
            </CardContent>
          </Card>
        </div>
      )}

      {topDepartments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Top departments by engagement
              <Link to="/organization/analytics" className="text-xs font-medium text-primary">
                Full analytics
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {topDepartments.map((dept) => (
              <div key={dept.departmentId} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium text-foreground">{dept.departmentName}</span>
                <span className="text-muted-foreground">{dept.studentCount} students · avg {dept.averagePoints} pts</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link to="/organization/invitations">
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center gap-3 py-4">
              <UserPlus className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Invite users</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/organization/departments">
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center gap-3 py-4">
              <FolderPlus className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Manage departments</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/organization/analytics">
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center gap-3 py-4">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">View full analytics</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
