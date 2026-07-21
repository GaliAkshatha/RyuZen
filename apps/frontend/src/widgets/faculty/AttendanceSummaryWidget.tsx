import { CheckCircle2 } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useRecentAttendanceSummary } from "@/features/events/hooks/useRecentAttendanceSummary";

/**
 * Wired in C3. FACULTY can access GET /:id/registrations (unlike
 * STUDENT), so this aggregates attendance across the 5 most recent
 * published/completed events client-side — see
 * useRecentAttendanceSummary.ts for why it's bounded rather than
 * covering every event ever created.
 */
export function AttendanceSummaryWidget() {
  const { data, isLoading } = useRecentAttendanceSummary();

  return (
    <WidgetCard title="Attendance Summary" icon={CheckCircle2} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : !data || data.eventCount === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No recent events to summarize.</p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="font-display text-2xl font-semibold text-foreground">
            {data.totalAttended} / {data.totalRegistered}
          </p>
          <p className="font-body text-sm text-muted-foreground">
            attended across the {data.eventCount} most recent event
            {data.eventCount === 1 ? "" : "s"}.
          </p>
        </div>
      )}
    </WidgetCard>
  );
}
