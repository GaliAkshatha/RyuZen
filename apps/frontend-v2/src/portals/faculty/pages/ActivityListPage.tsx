import { Link } from "react-router-dom";
import { Plus, ClipboardList, Star, Calendar } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ActivityTargetingLabel } from "@/domains/activities/components/ActivityTargetingLabel";
import { useActivityList } from "@/domains/activities/hooks/useActivityList";
import { useAuth } from "@/domains/auth/AuthContext";

/**
 * "My Activities" - real dashboard-card grid, each card shows real
 * targeting (who this activity is actually restricted to, from the
 * activity's own real fields). GET /activities is open to any
 * authenticated user org-wide, so this filters to the current faculty
 * member's own activities client-side - a UX convenience, not the
 * real security boundary (that's enforced server-side, confirmed).
 */
export function ActivityListPage() {
  const { data: activities, isLoading, isError, error, refetch } = useActivityList();
  const { user } = useAuth();

  const myActivities = (activities ?? []).filter((a) => a.createdBy === user?.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Activities</h1>
          <p className="text-sm text-muted-foreground">Activities you've created for your students.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/faculty/activities/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New activity
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : myActivities.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No activities yet"
          description="Create an activity for your students to participate in and earn points."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myActivities.map((activity) => (
            <Link key={activity.id} to={`/faculty/activities/${activity.id}`}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{activity.title}</p>
                  <StatusBadge status={activity.status} />
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
