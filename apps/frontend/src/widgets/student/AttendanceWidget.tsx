import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useMyAttendanceRecords } from "@/features/attendance/hooks/useMyAttendanceRecords";

/**
 * Genuinely wired now, using the real GET /attendance/records/me
 * endpoint - the earlier placeholder here predates the real
 * Attendance domain (rotating signed QR + GPS) entirely and was never
 * updated when that was built. Shows a real, recent-first summary:
 * how many sessions marked present/late out of the total real records
 * this student has.
 */
export function AttendanceWidget() {
  const { data: records, isLoading } = useMyAttendanceRecords();

  const total = records?.length ?? 0;
  const presentOrLate = (records ?? []).filter(
    (r) => r.status === "PRESENT" || r.status === "LATE",
  ).length;

  return (
    <WidgetCard title="Attendance" icon={CheckCircle2} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : total === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          No attendance records yet — they'll appear here once you mark attendance for a real
          session.
        </p>
      ) : (
        <Link to="/app/attendance/me" className="group flex flex-col gap-1 w-fit">
          <p className="font-display text-2xl font-bold leading-none text-foreground group-hover:text-primary">
            {presentOrLate}
            <span className="ml-1 font-body text-sm font-normal text-muted-foreground">
              / {total} sessions
            </span>
          </p>
          <p className="font-body text-xs text-muted-foreground">Present or late, all-time</p>
        </Link>
      )}
    </WidgetCard>
  );
}
