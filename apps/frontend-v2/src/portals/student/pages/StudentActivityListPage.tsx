import { Link } from "react-router-dom";
import { ClipboardList, Star, Calendar } from "lucide-react";

import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { ActivityTargetingLabel } from "@/domains/activities/components/ActivityTargetingLabel";
import { useActivityList } from "@/domains/activities/hooks/useActivityList";
import { useMySubmissions } from "@/domains/submissions/hooks/useMySubmissions";
import { ActivityStatus } from "@/domains/activities/activity.types";

/**
 * Real Student Activities view - dashboard-card grid, each card shows
 * real targeting (who this activity is actually restricted to).
 * Every real published activity is shown (not just ones the student
 * happens to be eligible for) - unlike Placement Drives there's no
 * dedicated eligibility-check endpoint for activities, so real
 * per-activity eligibility is only checked at submit time, surfaced
 * honestly on the detail page rather than approximated here.
 */
export function StudentActivityListPage() {
  const { data: activities, isLoading, isError, error, refetch } = useActivityList();
  const { data: mySubmissions } = useMySubmissions();

  const published = (activities ?? []).filter((a) => a.status === ActivityStatus.PUBLISHED);
  const submittedActivityIds = new Set((mySubmissions ?? []).map((s) => s.activityId));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Activities</h1>
        <p className="text-sm text-muted-foreground">Open activities you can submit to for points.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : published.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No open activities right now" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((activity) => (
            <Link key={activity.id} to={`/student/activities/${activity.id}`}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{activity.title}</p>
                  {submittedActivityIds.has(activity.id) && (
                    <span className="shrink-0 rounded-full bg-success/10 px-2 py-1 text-[11px] font-medium text-success">
                      Submitted
                    </span>
                  )}
                </div>
                <span className="w-fit rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {activity.type}
                </span>
                <div className="mt-auto flex flex-col gap-1.5">
                  <ActivityTargetingLabel activity={activity} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-warning">
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      {activity.points} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {new Date(activity.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
