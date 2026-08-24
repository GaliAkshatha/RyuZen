import { Link } from "react-router-dom";
import { Building2, Briefcase, Send, Lock, Users, Award, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";
import { usePlacementAnalytics } from "@/domains/placement-analytics/hooks/usePlacementAnalytics";
import { PlacementDriveStatus } from "@/domains/placement-drives/placementDrive.types";

const FUNNEL_STAGES = [
  { key: "appliedCount", label: "Applied", color: "bg-info" },
  { key: "shortlistedCount", label: "Shortlisted", color: "bg-warning" },
  { key: "selectedCount", label: "Selected", color: "bg-success" },
] as const;

/**
 * Real Placement Admin home - a real pipeline funnel (matching
 * Recruiter's and Platform Admin's treatment), reusing the already
 * confirmed real PlacementAnalyticsSummary (ORG_ADMIN/PLACEMENT_ADMIN
 * access) rather than a second, redundant applications fetch.
 */
export function PlacementAdminHomePage() {
  const { data: companies } = useCompanies();
  const { data: drives } = usePlacementDrives();
  const { data: analytics } = usePlacementAnalytics();

  const published = (drives ?? []).filter((d) => d.status === PlacementDriveStatus.PUBLISHED).length;
  const closed = (drives ?? []).filter((d) => d.status === PlacementDriveStatus.CLOSED).length;
  const maxCount = Math.max(analytics?.totalApplications ?? 0, 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Placements overview</h1>
        <p className="text-sm text-muted-foreground">A real snapshot of your placement pipeline.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Building2} value={companies?.length ?? 0} label="Companies" tone="primary" to="/placement-admin/companies" />
        <StatCard icon={Briefcase} value={drives?.length ?? 0} label="Total drives" tone="info" to="/placement-admin/drives" />
        <StatCard icon={Send} value={published} label="Published" tone="success" to="/placement-admin/drives" />
        <StatCard icon={Lock} value={closed} label="Closed" tone="warning" to="/placement-admin/drives" />
      </div>

      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Applications pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              {FUNNEL_STAGES.map((stage) => {
                const count = analytics[stage.key];
                const heightPercent = Math.max((count / maxCount) * 100, count > 0 ? 12 : 4);
                return (
                  <Link key={stage.key} to="/placement-admin/analytics" className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-24 w-full items-end">
                      <div className={`w-full rounded-t-md ${stage.color}`} style={{ height: `${heightPercent}%` }} />
                    </div>
                    <p className="text-sm font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{stage.label}</p>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {analytics && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard icon={Users} value={analytics.totalApplications} label="Total applications" tone="primary" to="/placement-admin/analytics" />
          <StatCard icon={Award} value={`${analytics.placementRate}%`} label="Selected of applications" tone="success" to="/placement-admin/analytics" />
          <StatCard icon={Building2} value={analytics.activeCompanies} label="Active companies" tone="info" to="/placement-admin/companies" />
        </div>
      )}

      <Link to="/placement-admin/analytics">
        <Card className="transition-colors hover:border-primary/40">
          <CardContent className="flex items-center justify-between py-3.5">
            <span className="text-sm font-medium text-foreground">View full placement analytics</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
