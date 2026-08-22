import { Link } from "react-router-dom";
import { Plus, ClipboardList } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useActivityList } from "@/domains/activities/hooks/useActivityList";
import { useAuth } from "@/domains/auth/AuthContext";

/**
 * "My Activities" - the real GET /activities is open to any
 * authenticated user (read visibility for the whole org, confirmed
 * directly), so this page filters to the current faculty member's own
 * activities client-side for a "my activities" experience. Faculty
 * cannot write/publish/close/delete anything they didn't create
 * anyway (enforced server-side by this session's real fix), so this
 * filter is a real UX convenience, not the actual security boundary.
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
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
        <div className="flex flex-col gap-2">
          {myActivities.map((activity) => (
            <Link key={activity.id} to={`/faculty/activities/${activity.id}`}>
              <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/40">
                <div>
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type} · {activity.points} pts · Due {new Date(activity.endDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={activity.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
