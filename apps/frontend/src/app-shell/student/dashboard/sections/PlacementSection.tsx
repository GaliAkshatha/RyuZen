import { Link } from "react-router-dom";
import { Briefcase, FileText } from "lucide-react";

import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { JobApplicationStatus } from "@/types/enums";

import { useMyJobApplications } from "@/features/job-applications/hooks/useMyJobApplications";
import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";
import { InterviewRoundsPanel } from "@/features/interview-rounds/components/InterviewRoundsPanel";

/**
 * "What opportunities and applications currently need my attention?"
 * - not a readiness/probability metric, which does not exist in the
 * backend and is not fabricated here. Two independent real sources:
 * my own applications, and published drives I haven't applied to yet.
 *
 * The real InterviewRoundsPanel (read-only) is shown inline, but only
 * for the single most relevant application (most recent one at
 * SHORTLISTED or later) - showing it per-application would clutter a
 * compact dashboard section; the full picture is one click away via
 * "View all applications."
 */
export function PlacementSection() {
  const { data: applications, isLoading: loadingApps, isError: appsError } = useMyJobApplications();
  const { data: drives, isLoading: loadingDrives, isError: drivesError } = usePlacementDrives();

  const isLoading = loadingApps || loadingDrives;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-card/60 p-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const driveById = new Map((drives ?? []).map((d) => [d.id, d]));

  const appliedDriveIds = new Set((applications ?? []).map((a) => a.placementId));
  const opportunities = (drives ?? [])
    .filter((d) => d.status === "PUBLISHED" && !appliedDriveIds.has(d.id))
    .slice(0, 4);

  // "Active" means not terminal-and-unsuccessful. REJECTED is
  // unambiguously excluded - a rejected application is resolved, not
  // active, and showing it under this heading was a confirmed
  // business-logic bug (found via audit, not assumed). SELECTED is
  // deliberately kept visible: whether an offer counts as "active" or
  // "resolved" is a genuine product decision this fix does not make
  // silently - keeping it visible is the safer default, since hiding
  // a real offer would be the more harmful mistake of the two.
  const activeApplications = [...(applications ?? [])]
    .filter((a) => a.status !== JobApplicationStatus.REJECTED)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 4);

  // No backend concept of "the relevant application" exists anywhere
  // in the domain (confirmed via audit - GetInterviewRoundsForApplicationUseCase
  // operates per-application-id only, with no ranking logic). This is
  // a frontend-only heuristic: the most recently applied-to
  // application that has reached SHORTLISTED or SELECTED. If a
  // student has two applications at that stage, the older one's
  // interview status is not shown here - full detail remains one
  // click away via "View all applications."
  const mostRecentActiveInterviewApplication = activeApplications.find(
    (a) => a.status === JobApplicationStatus.SHORTLISTED || a.status === JobApplicationStatus.SELECTED,
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/60 p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Active Applications
            </p>
            <Link
              to="/app/placements/applications"
              className="font-body text-xs text-primary underline underline-offset-4"
            >
              View all
            </Link>
          </div>
          {appsError ? (
            <p className="font-body text-sm text-muted-foreground">Applications are unavailable right now.</p>
          ) : activeApplications.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">You haven't applied to any drives yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {activeApplications.map((app) => (
                <li key={app.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1">
                  <span className="truncate font-body text-sm text-foreground">
                    {driveById.get(app.placementId)?.title ?? app.placementId}
                  </span>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              Relevant Opportunities
            </p>
            <Link to="/app/placements/drives" className="font-body text-xs text-primary underline underline-offset-4">
              View all
            </Link>
          </div>
          {drivesError ? (
            <p className="font-body text-sm text-muted-foreground">Opportunities are unavailable right now.</p>
          ) : opportunities.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No new opportunities right now.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {opportunities.map((drive) => (
                <li key={drive.id}>
                  <Link
                    to={`/app/placements/drives/${drive.id}`}
                    className="block truncate rounded-md px-2 py-1 font-body text-sm text-foreground transition-colors hover:bg-accent/50"
                  >
                    {drive.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {mostRecentActiveInterviewApplication && (
        <div className="border-t border-border pt-3">
          <p className="mb-2 font-body text-xs text-muted-foreground">
            Interview status — {driveById.get(mostRecentActiveInterviewApplication.placementId)?.title ?? "your most recent active application"}
          </p>
          <InterviewRoundsPanel applicationId={mostRecentActiveInterviewApplication.id} readOnly />
        </div>
      )}
    </div>
  );
}
