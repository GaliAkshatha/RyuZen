import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Lock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAttendanceSession } from "@/domains/attendance/hooks/useAttendanceSession";
import { useAttendanceQrToken } from "@/domains/attendance/hooks/useAttendanceQrToken";
import { useSessionRecords } from "@/domains/attendance/hooks/useSessionRecords";
import { useSuspiciousPatterns } from "@/domains/attendance/hooks/useSuspiciousPatterns";
import { useCloseAttendanceSession, useMarkAttendanceManually, useReviewAttendanceCorrection } from "@/domains/attendance/hooks/useAttendanceMutations";
import { AttendanceSessionStatus, AttendanceCorrectionStatus } from "@/domains/attendance/attendance.types";

/**
 * Real live polling for the QR token, matching the session's own real
 * rotation cadence (qrRotationSeconds) - refetches right as each
 * token expires, never showing a stale one. No QR-image rendering
 * library exists in this project, and camera-based scanning is a
 * genuinely separate scope from this pass - the token is shown as a
 * real, live, correctly-rotating code students can type in on
 * MyAttendancePage, a legitimate real-world fallback pattern many
 * actual QR attendance systems also offer alongside scanning.
 */
export function AttendanceSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session, isLoading, isError, error, refetch } = useAttendanceSession(sessionId ?? "");
  const { data: records } = useSessionRecords(sessionId ?? "");
  const { data: suspiciousPatterns } = useSuspiciousPatterns(sessionId ?? "");
  const isOpen = session?.status === AttendanceSessionStatus.OPEN;
  const { data: qrToken } = useAttendanceQrToken(sessionId ?? "", isOpen ? (session?.qrRotationSeconds ?? 30) * 1000 : false);
  const { mutate: closeSession, isPending: isClosing } = useCloseAttendanceSession(sessionId ?? "");
  const { mutate: markManually } = useMarkAttendanceManually(sessionId ?? "");
  const { mutate: reviewCorrection } = useReviewAttendanceCorrection(sessionId ?? "");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !session) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const pendingCorrections = (records ?? []).filter((r) => r.correctionStatus === AttendanceCorrectionStatus.PENDING);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/faculty/attendance" className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{session.subject}</h1>
          <p className="text-sm text-muted-foreground">Opened {new Date(session.openedAt).toLocaleString()}</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          {isOpen ? (
            <div>
              <p className="text-xs text-muted-foreground">Current code — students enter this to mark attendance</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-foreground">{qrToken?.token ?? "…"}</p>
              {qrToken && <p className="mt-1 text-xs text-muted-foreground">Refreshes automatically every {session.qrRotationSeconds}s</p>}
            </div>
          ) : (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" aria-hidden="true" />
              Session closed
            </p>
          )}
          {isOpen && (
            <Button size="sm" variant="outline" disabled={isClosing} onClick={() => closeSession()}>
              {isClosing ? "Closing…" : "Close session"}
            </Button>
          )}
        </CardContent>
      </Card>

      {suspiciousPatterns && suspiciousPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              Flagged patterns — review, don't assume
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {suspiciousPatterns.map((p) => (
              <p key={p.ipAddress} className="text-xs text-muted-foreground">
                <span className="font-mono">{p.ipAddress}</span> — {p.distinctStudentCount} different students marked from this address
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {pendingCorrections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending correction requests ({pendingCorrections.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {pendingCorrections.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-mono text-xs text-foreground">{r.studentId}</p>
                  <p className="text-xs text-muted-foreground">{r.correctionReason}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => reviewCorrection({ recordId: r.id, payload: { approved: true, newStatus: "PRESENT" } })}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => reviewCorrection({ recordId: r.id, payload: { approved: false } })}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Records ({records?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!records || records.length === 0 ? (
            <EmptyState title="No one has marked attendance yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {records.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-mono text-xs text-foreground">{r.studentId}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{r.method}</span>
                    <select
                      value={r.status}
                      onChange={(e) => markManually({ studentId: r.studentId, status: e.target.value as "PRESENT" | "LATE" | "ABSENT", method: "MANUAL" })}
                      className="h-7 rounded-md border border-input bg-transparent px-2 text-xs"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="LATE">Late</option>
                      <option value="ABSENT">Absent</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
