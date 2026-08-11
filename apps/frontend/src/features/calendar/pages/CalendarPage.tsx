import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronLeft, ChevronRight, Briefcase, ClipboardCheck, Calendar as CalendarIcon } from "lucide-react";

import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/components/Spinner";
import { cn } from "@/utils/cn";

import { useEvents } from "@/features/events/hooks/useEvents";
import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";
import { useAssessments } from "@/features/assessments/hooks/useAssessments";

import { getMonthGridDays, isSameDay, isSameMonth } from "@/features/calendar/utils/monthGrid";

interface ScheduleItem {
  id: string;
  label: string;
  date: Date;
  to: string;
  icon: typeof CalendarIcon;
  colorClass: string;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * "The Calendar should become the student's single schedule view" -
 * built from the same 3 real, already-proven sources UpcomingWidget
 * uses (published Events, published Placement Drive deadlines,
 * published Assessment windows), now shown as a genuine month grid
 * plus a full agenda list, not just the dashboard's top-5 snippet.
 *
 * Deliberately does NOT include Interview Rounds or "mentorship
 * sessions" yet: Mentorship has no real per-session date data at all
 * (just a one-time assignedDate - see MentorshipResponseDto), and
 * Interview Rounds would need aggregating across every one of a
 * student's applications (no single "all my rounds" endpoint exists).
 * That's a real, bounded follow-up (useQueries across applications),
 * not something to fake here.
 */
export function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const { data: events, isLoading: loadingEvents } = useEvents();
  const { data: drives, isLoading: loadingDrives } = usePlacementDrives();
  const { data: assessments, isLoading: loadingAssessments } = useAssessments();

  const isLoading = loadingEvents || loadingDrives || loadingAssessments;

  const items: ScheduleItem[] = [
    ...(events ?? [])
      .filter((e) => e.status === "PUBLISHED")
      .map((e) => ({
        id: `event-${e.id}`,
        label: e.title,
        date: new Date(e.startDate),
        to: `/app/events/${e.id}`,
        icon: CalendarIcon,
        colorClass: "bg-primary",
      })),
    ...(drives ?? [])
      .filter((d) => d.status === "PUBLISHED" && d.deadline)
      .map((d) => ({
        id: `drive-${d.id}`,
        label: `Drive: ${d.title}`,
        date: new Date(d.deadline!),
        to: `/app/placements/drives/${d.id}`,
        icon: Briefcase,
        colorClass: "bg-warning",
      })),
    ...(assessments ?? [])
      .filter((a) => a.status === "PUBLISHED" && a.startsAt)
      .map((a) => ({
        id: `assessment-${a.id}`,
        label: a.title,
        date: new Date(a.startsAt!),
        to: "/app/assessments",
        icon: ClipboardCheck,
        colorClass: "bg-success",
      })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const gridDays = getMonthGridDays(year, month);
  const today = new Date();

  const upcoming = items.filter((item) => item.date >= today).slice(0, 8);

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="constellation" />

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <CalendarDays className="h-6 w-6 text-primary" aria-hidden="true" />
          Calendar
        </h1>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="min-w-32 text-center font-body text-sm font-medium text-foreground">
            {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-7 border-b border-border bg-card/60">
              {WEEKDAY_LABELS.map((day) => (
                <div key={day} className="p-2 text-center font-body text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {gridDays.map((day) => {
                const dayItems = items.filter((item) => isSameDay(item.date, day));
                const inMonth = isSameMonth(day, month, year);
                const isToday = isSameDay(day, today);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "flex min-h-24 flex-col gap-1 border-b border-r border-border p-1.5",
                      !inMonth && "bg-muted/20",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full font-body text-xs",
                        isToday
                          ? "bg-primary font-semibold text-primary-foreground"
                          : inMonth
                            ? "text-foreground"
                            : "text-muted-foreground/50",
                      )}
                    >
                      {day.getDate()}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      {dayItems.slice(0, 3).map((item) => (
                        <Link
                          key={item.id}
                          to={item.to}
                          className="truncate rounded px-1 py-0.5 font-body text-[10px] text-foreground hover:bg-accent/60"
                          title={item.label}
                        >
                          <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full", item.colorClass)} />
                          {item.label}
                        </Link>
                      ))}
                      {dayItems.length > 3 && (
                        <span className="px-1 font-body text-[10px] text-muted-foreground">
                          +{dayItems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-body text-sm font-semibold text-foreground">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">Nothing on the horizon right now.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {upcoming.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-2 rounded-md border border-border bg-card/60 p-2 transition-colors hover:border-primary/40"
                    >
                      <item.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-sm text-foreground">{item.label}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {item.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
