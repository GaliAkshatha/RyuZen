import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { StatusBadge } from "@/shared/components/StatusBadge";

import { useActivities } from "@/features/activities/hooks/useActivities";
import { ActivityStatus } from "@/types/enums";

/** Wired in AC1, per that milestone's dashboard-widget wiring. */
export function RecentActivitiesWidget() {
  const { data: activities, isLoading } = useActivities({ status: ActivityStatus.PUBLISHED });

  const recent = (activities ?? []).slice(0, 4);

  return (
    <WidgetCard title="Recent Activities" icon={ClipboardList} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : recent.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No published activities yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((activity) => (
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
