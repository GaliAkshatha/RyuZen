import { Users, Network, ClipboardList, Building2, TrendingUp, Award, Sparkles, Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { ScoreRing } from "@/shared/components/ScoreRing";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { useOrgDashboard } from "@/domains/org-dashboard/hooks/useOrgDashboard";

/**
 * Real dashboard aggregate - confirmed SUPER_ADMIN/ORG_ADMIN, scoped
 * to the caller's own organizationId. Titled "Organization Overview,"
 * not "Platform Analytics" - deliberately honest, since this reflects
 * one organization's data, not a true cross-platform aggregate (no
 * such endpoint exists in the real backend).
 */
export function OrgAnalyticsPage() {
  const { data, isLoading, isError, error, refetch } = useOrgDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Organization overview</h1>
        <p className="text-sm text-muted-foreground">A real, live snapshot of your organization's activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} value={data.users.total} label="Total users" tone="primary" trend={`${data.users.students} students`} />
        <StatCard icon={Network} value={data.departments} label="Departments" tone="info" />
        <StatCard icon={ClipboardList} value={data.activities.total} label="Activities" tone="success" trend={`${data.activities.pendingReviews} pending review`} />
        <StatCard icon={Building2} value={data.placements.totalCompanies} label="Companies" tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Card>
          <CardHeader><CardTitle>Student engagement</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-2 py-2">
            <ScoreRing value={data.studentEngagementPercent} size={130} />
            <p className="text-xs text-muted-foreground">{data.activeStudents} active in last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Real activity, this organization</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard icon={TrendingUp} value={data.xpEarned} label="Total XP earned" tone="primary" />
            <StatCard icon={Award} value={data.certificatesEarned} label="Certificates issued" tone="success" />
            <StatCard icon={ClipboardList} value={data.activitiesCompleted} label="Activities completed" tone="info" />
            <StatCard icon={Sparkles} value={data.aiUsage.chatConversations} label="AI chat conversations" tone="warning" />
            <StatCard icon={Sparkles} value={data.aiUsage.mockInterviews} label="Mock interviews taken" tone="warning" />
            <StatCard icon={Briefcase} value={data.placements.selectedCount} label="Students placed" tone="success" />
          </CardContent>
        </Card>
      </div>

      {data.departmentComparison.length > 0 && (
        <Card>
          <CardHeader><CardTitle>By department</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {data.departmentComparison.map((dept) => (
                <div key={dept.departmentId} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <span className="font-medium text-foreground">{dept.departmentName}</span>
                  <span className="text-muted-foreground">{dept.studentCount} students · avg {dept.averagePoints} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
