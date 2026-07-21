import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

import { useActivities } from "@/features/activities/hooks/useActivities";

/**
 * Wired in AC1. Unlike Faculty.id/Student.id (which need
 * cross-referencing — see facultyLabels.ts/studentLabels.ts),
 * Activity.createdBy is the creating user's own User.id directly, so
 * filtering to "my activities" needs no lookup — just the current
 * user's id from AuthContext.
 */
export function AssignedActivitiesWidget() {
  const { user } = useAuth();
  const { data: activities, isLoading } = useActivities(user ? { createdBy: user.id } : undefined);

  const mine = (activities ?? []).slice(0, 4);

  return (
    <WidgetCard title="Assigned Activities" icon={ClipboardList} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : mine.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          You haven't created any activities yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {mine.map((activity) => (
            <li key={activity.id}>
              <Link
                to={`/app/activities/${activity.id}`}
                className="flex items-center justify-between gap-2 font-body text-sm text-foreground hover:underline"
              >
                <span className="truncate">{activity.title}</span>
                <StatusBadge status={activity.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
