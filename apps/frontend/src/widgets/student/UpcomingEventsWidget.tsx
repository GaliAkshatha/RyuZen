import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useEvents } from "@/features/events/hooks/useEvents";
import { EventStatus } from "@/types/enums";

/**
 * Wired in C2. Shows upcoming published events open for browsing — not
 * specifically "events you're registered for", since GET
 * /:id/registrations excludes STUDENT entirely (confirmed this
 * milestone, see RegisterForEventSection.tsx) and there is no
 * backend-supported way for a student to list their own registrations.
 */
export function UpcomingEventsWidget() {
  const { data: events, isLoading } = useEvents();

  const upcoming = (events ?? [])
    .filter((e) => e.status === EventStatus.PUBLISHED && new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 4);

  return (
    <WidgetCard title="Upcoming Events" icon={Calendar} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : upcoming.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No upcoming events right now.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {upcoming.map((event) => (
            <li key={event.id}>
              <Link
                to={`/app/events/${event.id}`}
                className="flex items-center justify-between gap-2 font-body text-sm text-foreground hover:underline"
              >
                <span className="truncate">{event.title}</span>
                <span className="shrink-0 text-muted-foreground">
                  {new Date(event.startDate).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
