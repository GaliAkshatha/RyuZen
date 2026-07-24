import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { Badge } from "@/shared/ui/Badge";

import { useEvents } from "@/features/events/hooks/useEvents";
import { EventStatus } from "@/types/enums";

/**
 * Wired in C2. Shows upcoming published events open for browsing — not
 * specifically "events you're registered for", since GET
 * /:id/registrations excludes STUDENT entirely (confirmed this
 * milestone, see RegisterForEventSection.tsx) and there is no
 * backend-supported way for a student to list their own registrations.
 *
 * "In N days" badge is a real computation from each event's own
 * startDate, not decorative — genuinely useful urgency signal.
 */
function daysUntilLabel(startDate: string): string {
  const days = Math.ceil((new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d`;
}

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
        <ul className="flex flex-col gap-1">
          {upcoming.map((event) => (
            <li key={event.id}>
              <Link
                to={`/app/events/${event.id}`}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 font-body text-sm text-foreground transition-colors hover:bg-accent/50"
              >
                <span className="truncate">{event.title}</span>
                <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
                  {daysUntilLabel(event.startDate)}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
