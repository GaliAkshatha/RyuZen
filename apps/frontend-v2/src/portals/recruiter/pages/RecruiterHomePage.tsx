import { Briefcase, Users, CheckCircle2, Award } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { useMyRecruiterProfile } from "@/domains/recruiters/hooks/useMyRecruiterProfile";
import { useMyApplicants } from "@/domains/recruiters/hooks/useMyApplicants";
import { usePlacementDrives } from "@/domains/placement-drives/hooks/usePlacementDrives";
import { JobApplicationStatus } from "@/domains/job-applications/jobApplication.types";

/** Real Recruiter home - counts from the real self-scoped applicants + drives filtered to this recruiter's own real company. */
export function RecruiterHomePage() {
  const { data: profile } = useMyRecruiterProfile();
  const { data: applicants } = useMyApplicants();
  const { data: drives } = usePlacementDrives();

  const myDrives = (drives ?? []).filter((d) => d.companyId === profile?.companyId);
  const shortlisted = (applicants ?? []).filter((a) => a.status === JobApplicationStatus.SHORTLISTED).length;
  const selected = (applicants ?? []).filter((a) => a.status === JobApplicationStatus.SELECTED).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Recruiting overview</h1>
        <p className="text-sm text-muted-foreground">A real snapshot of your company's hiring pipeline.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Briefcase} value={myDrives.length} label="My drives" tone="primary" />
        <StatCard icon={Users} value={applicants?.length ?? 0} label="Applicants" tone="info" />
        <StatCard icon={CheckCircle2} value={shortlisted} label="Shortlisted" tone="warning" />
        <StatCard icon={Award} value={selected} label="Selected" tone="success" />
      </div>
    </div>
  );
}
