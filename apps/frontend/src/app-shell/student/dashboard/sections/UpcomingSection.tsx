import { Link } from "react-router-dom";
import { Calendar, Briefcase, ClipboardCheck } from "lucide-react";

import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { Badge } from "@/shared/ui/Badge";

import { useEvents } from "@/features/events/hooks/useEvents";
import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";
import { useAssessments } from "@/features/assessments/hooks/useAssessments";

interface UpcomingItem {
  id: string;
  typeLabel: string;
  icon: typeof Calendar;
  title: string;
  dateLabel: string;
  date: Date;
  to: string;
}

/**
 * Three genuinely different business events (attend / apply-by / take)
 * sharing only "has a future date." Each keeps its own type label and
 * date phrasing - never collapsed into one generic "Events" list, per
 * the approved spec's explicit example format.
 */
export function UpcomingSection() {
  const { data: events, isLoading: loadingEvents, isError: eventsError } = useEvents();
  const { data: drives, isLoading: loadingDrives, isError: drivesError } = usePlacementDrives();
  const {
    data: assessments,
    isLoading: loadingAssessments,
    isError: assessmentsError,
  } = useAssessments();

  const isLoading = loadingEvents || loadingDrives || loadingAssessments;
  // A failed source degrades gracefully rather than blanking the whole
  // section - each source is independent (per the approved multi-request rule).
  const allFailed = eventsError && drivesError && assessmentsError;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLoader key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const now = new Date();

  const items: UpcomingItem[] = [
    ...(eventsError
      ? []
      : (events ?? [])
          .filter((e) => e.status === "PUBLISHED" && new Date(e.startDate) >= now)
          .map((e) => ({
            id: `event-${e.id}`,
            typeLabel: "EVENT",
            icon: Calendar,
            title: e.title,
            dateLabel: new Date(e.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            date: new Date(e.startDate),
            to: `/app/events/${e.id}`,
          }))),
    ...(drivesError
      ? []
      : (drives ?? [])
          .filter((d) => d.status === "PUBLISHED" && d.deadline && new Date(d.deadline) >= now)
          .map((d) => ({
            id: `drive-${d.id}`,
            typeLabel: "DRIVE",
            icon: Briefcase,
            title: d.title,
            dateLabel: `Application deadline ${new Date(d.deadline!).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
            date: new Date(d.deadline!),
            to: `/app/placements/drives/${d.id}`,
          }))),
    ...(assessmentsError
      ? []
      : (assessments ?? [])
          .filter((a) => a.status === "PUBLISHED" && a.startsAt && new Date(a.startsAt) >= now)
          .map((a) => ({
            id: `assessment-${a.id}`,
            typeLabel: "ASSESSMENT",
            icon: ClipboardCheck,
            title: a.title,
            dateLabel: `Starts ${new Date(a.startsAt!).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
            date: new Date(a.startsAt!),
            to: "/app/assessments",
          }))),
  ]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-4">
      <p className="font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upcoming</p>
      {allFailed ? (
        <p className="font-body text-sm text-muted-foreground">Upcoming items are unavailable right now.</p>
      ) : items.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">You have nothing upcoming right now.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[9px]">
                      {item.typeLabel}
                    </Badge>
                    <span className="truncate font-body text-sm text-foreground">{item.title}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{item.dateLabel}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
