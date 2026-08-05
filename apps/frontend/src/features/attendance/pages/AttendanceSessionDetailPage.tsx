import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Users, AlertTriangle, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useToast } from "@/hooks/useToast";

import { useAttendanceSession } from "@/features/attendance/hooks/useAttendanceSession";
import { useQrToken } from "@/features/attendance/hooks/useQrToken";
import { useSessionRecords } from "@/features/attendance/hooks/useSessionRecords";
import { useSuspiciousPatterns } from "@/features/attendance/hooks/useSuspiciousPatterns";
import { useCloseAttendanceSession } from "@/features/attendance/hooks/useCloseAttendanceSession";

/**
 * The real, live centerpiece: a QR image that genuinely changes as
 * the server rotates the underlying signed token - the QR encodes a
 * real URL (session id + the current real token as query params), so
 * a student scans it with their phone's normal camera app, which
 * opens the mark-attendance page directly. No in-app camera scanner
 * needed, and the raw HMAC secret is never sent to any client - only
 * this derived, time-boxed token is.
 */
export function AttendanceSessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session, isLoading: sessionLoading, isError, error } = useAttendanceSession(sessionId!);
  const rotationMs = (session?.qrRotationSeconds ?? 20) * 1000;

  const { data: qrToken } = useQrToken(sessionId!, rotationMs);
  const { data: records, isLoading: recordsLoading } = useSessionRecords(sessionId!);
  const { data: suspiciousPatterns } = useSuspiciousPatterns(sessionId!);
  const { mutate: closeSession, isPending: isClosing } = useCloseAttendanceSession();

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (sessionLoading || !session) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const markUrl = qrToken
    ? `${window.location.origin}/app/attendance/mark?sessionId=${sessionId}&token=${qrToken.token}`
    : null;

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <QrCode className="h-6 w-6 text-primary" aria-hidden="true" />
          {session.subject}
        </h1>
        <div className="flex items-center gap-2">
          <StatusBadge status={session.status} />
          {session.status === "OPEN" && (
            <Button
              variant="outline"
              disabled={isClosing}
              onClick={() =>
                closeSession(sessionId!, {
                  onSuccess: () => toast({ title: "Session closed" }),
                })
              }
            >
              {isClosing ? "Closing…" : "Close Session"}
            </Button>
          )}
        </div>
      </div>

      {session.status === "OPEN" && (
        <Card>
          <CardHeader>
            <CardTitle>Scan to Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 py-6">
            {markUrl ? (
              <QRCodeSVG value={markUrl} size={256} level="M" />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center">
                <Spinner size="lg" />
              </div>
            )}
            <p className="font-body text-xs text-muted-foreground">
              Refreshes automatically every {session.qrRotationSeconds}s - a screenshot only works
              within its own rotation window.
            </p>
            {session.requireLocation && (
              <p className="font-body text-xs text-muted-foreground">
                Students must be within {session.radiusMeters}m of the session location.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {suspiciousPatterns && suspiciousPatterns.length > 0 && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Worth Reviewing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
              {suspiciousPatterns.map((pattern) => (
                <li key={pattern.ipAddress}>
                  {pattern.distinctStudentCount} different students marked attendance from the same
                  network address ({pattern.ipAddress}) - this may be a shared lab/campus network, or
                  worth a closer look.
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            Marked ({records?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recordsLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          ) : !records || records.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">
              No one has marked attendance yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {records.map((record) => (
                <li
                  key={record.id}
                  className="flex items-center justify-between rounded-md border border-border p-2"
                >
                  <span className="font-body text-sm text-foreground">{record.studentId}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs text-muted-foreground">{record.method}</span>
                    <StatusBadge status={record.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Button variant="ghost" size="sm" className="w-fit" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-3 w-3" aria-hidden="true" />
        Back
      </Button>
    </div>
  );
}
