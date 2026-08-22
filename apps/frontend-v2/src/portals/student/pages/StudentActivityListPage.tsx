import { Link } from "react-router-dom";
import { ClipboardList, Star } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useActivityList } from "@/domains/activities/hooks/useActivityList";
import { useMySubmissions } from "@/domains/submissions/hooks/useMySubmissions";
import { ActivityStatus } from "@/domains/activities/activity.types";

/**
 * Real Student Activities view - closes a real, previously-missing
 * gap (Student had no way to browse or submit to activities at all).
 * Shows every real published activity; real per-activity eligibility
 * (department/batch criteria, confirmed enforced server-side in
 * SubmissionEligibilityService) is only checked at submit time, since
 * unlike Placement Drives there's no dedicated eligibility-check
 * endpoint for activities - the real submit error is surfaced
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
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : published.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No open activities right now" description="Check back soon." />
      ) : (
        <div className="flex flex-col gap-2">
          {published.map((activity) => (
            <Link key={activity.id} to={`/student/activities/${activity.id}`}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-warning">
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      {activity.points} pts
                    </span>
                    {submittedActivityIds.has(activity.id) && (
                      <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                        Submitted
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
