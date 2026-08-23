import { Link } from "react-router-dom";
import { Briefcase, Users, CheckCircle2, Award, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { useMyRecruiterProfile } from "@/domains/recruiters/hooks/useMyRecruiterProfile";
import { useMyApplicants } from "@/domains/recruiters/hooks/useMyApplicants";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";
import { JobApplicationStatus } from "@/domains/job-applications/jobApplication.types";

const FUNNEL_STAGES = [
  { status: JobApplicationStatus.APPLIED, label: "Applied", color: "bg-info" },
  { status: JobApplicationStatus.SHORTLISTED, label: "Shortlisted", color: "bg-warning" },
  { status: JobApplicationStatus.SELECTED, label: "Selected", color: "bg-success" },
];

/**
 * Real Recruiter home - a real pipeline funnel (per the approved
 * wireframe), not just a stat grid. Every card and funnel stage links
 * to a real related page.
 */
export function RecruiterHomePage() {
  const { data: profile } = useMyRecruiterProfile();
  const { data: applicants } = useMyApplicants();
  const { data: drives } = usePlacementDrives();

  const myDrives = (drives ?? []).filter((d) => d.companyId === profile?.companyId);
  const shortlisted = (applicants ?? []).filter((a) => a.status === JobApplicationStatus.SHORTLISTED).length;
  const selected = (applicants ?? []).filter((a) => a.status === JobApplicationStatus.SELECTED).length;
  const totalApplicants = applicants?.length ?? 0;
  const maxCount = Math.max(totalApplicants, 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Recruiting overview</h1>
        <p className="text-sm text-muted-foreground">A real snapshot of your company's hiring pipeline.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Briefcase} value={myDrives.length} label="My drives" tone="primary" to="/recruiter/drives" />
        <StatCard icon={Users} value={totalApplicants} label="Applicants" tone="info" to="/recruiter/applicants" />
        <StatCard icon={CheckCircle2} value={shortlisted} label="Shortlisted" tone="warning" to="/recruiter/applicants" />
        <StatCard icon={Award} value={selected} label="Selected" tone="success" to="/recruiter/applicants" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            {FUNNEL_STAGES.map((stage) => {
              const count = (applicants ?? []).filter((a) => a.status === stage.status).length;
              const heightPercent = Math.max((count / maxCount) * 100, count > 0 ? 12 : 4);
              return (
                <Link key={stage.status} to="/recruiter/applicants" className="flex flex-1 flex-col items-center gap-2">
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

      <Link to="/recruiter/applicants">
        <Card className="transition-colors hover:border-primary/40">
          <CardContent className="flex items-center justify-between py-3.5">
            <span className="text-sm font-medium text-foreground">View your real applicant pipeline</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
