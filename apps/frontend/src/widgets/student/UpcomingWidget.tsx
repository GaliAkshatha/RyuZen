import { Link } from "react-router-dom";
import { Calendar, Briefcase, ClipboardCheck } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { Badge } from "@/shared/ui/Badge";
import { EventStatus } from "@/types/enums";

import { useEvents } from "@/features/events/hooks/useEvents";
import { usePlacementDrives } from "@/features/placement-drives/hooks/usePlacementDrives";
import { useAssessments } from "@/features/assessments/hooks/useAssessments";

function daysUntilLabel(date: string): string {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d`;
}

interface UpcomingItem {
  id: string;
  label: string;
  date: string;
  to: string;
  icon: typeof Calendar;
}

/**
 * The wireframe's "Upcoming" section mixes genuinely different kinds
 * of real deadlines (an assessment window, a placement drive closing)
 * into one time-ordered list - real, useful "what's coming up for me"
 * rather than three separate, harder-to-scan widgets. Every source
 * here is real: published events (browsable, not registration-based -
 * see UpcomingEventsWidget's own note on why), published assessments
 * with a real startsAt, and published placement drives with a real
 * deadline.
 */
export function UpcomingWidget() {
  const { data: events, isLoading: loadingEvents } = useEvents();
  const { data: drives, isLoading: loadingDrives } = usePlacementDrives();
  const { data: assessments, isLoading: loadingAssessments } = useAssessments();

  const isLoading = loadingEvents || loadingDrives || loadingAssessments;

  const items: UpcomingItem[] = [
    ...(events ?? [])
      .filter((e) => e.status === EventStatus.PUBLISHED && new Date(e.startDate) >= new Date())
      .map((e) => ({
        id: `event-${e.id}`,
        label: e.title,
        date: e.startDate,
        to: `/app/events/${e.id}`,
        icon: Calendar,
      })),
    ...(drives ?? [])
      .filter((d) => d.status === "PUBLISHED" && d.deadline && new Date(d.deadline) >= new Date())
      .map((d) => ({
        id: `drive-${d.id}`,
        label: `Drive: ${d.title}`,
        date: d.deadline!,
        to: `/app/placements/drives/${d.id}`,
        icon: Briefcase,
      })),
    ...(assessments ?? [])
      .filter(
        (a) =>
          a.status === "PUBLISHED" && a.startsAt && new Date(a.startsAt) >= new Date(),
      )
      .map((a) => ({
        id: `assessment-${a.id}`,
        label: a.title,
        date: a.startsAt!,
        to: "/app/assessments",
        icon: ClipboardCheck,
      })),
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <WidgetCard title="Upcoming" icon={Calendar} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : items.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">Nothing on the horizon right now.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 font-body text-sm text-foreground transition-colors hover:bg-accent/50"
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
                  {daysUntilLabel(item.date)}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
