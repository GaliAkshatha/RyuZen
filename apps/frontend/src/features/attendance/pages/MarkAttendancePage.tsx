import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, MapPin, XCircle } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { Spinner } from "@/shared/components/Spinner";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";

import { useAttendanceSession } from "@/features/attendance/hooks/useAttendanceSession";
import { useMarkAttendanceViaQr } from "@/features/attendance/hooks/useMarkAttendanceViaQr";

/**
 * The real destination when a student scans the rotating QR with
 * their phone's own camera app - sessionId and the current real
 * token both arrive as URL query params (no in-app camera scanning
 * needed). GPS is only ever requested when the real session actually
 * requires it (session.requireLocation), never unconditionally.
 */
export function MarkAttendancePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";
  const token = searchParams.get("token") ?? "";

  const { data: session, isLoading: sessionLoading } = useAttendanceSession(sessionId);
  const { mutate, isPending, isSuccess, error, data: result } = useMarkAttendanceViaQr();

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || isSuccess || isPending) return;

    if (!session.requireLocation) {
      mutate({ sessionId, token });
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't available in this browser — attendance can't be marked.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        mutate({
          sessionId,
          token,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocating(false);
        setLocationError("Couldn't get your real location — check browser permissions and try again.");
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (!sessionId || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-sm">
          <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
            <XCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            <p className="font-body text-sm text-muted-foreground">
              This link is missing required information. Scan the real QR code again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <PageAtmosphere variant="academy" />
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          {sessionLoading ? (
            <>
              <Spinner size="lg" />
              <p className="font-body text-sm text-muted-foreground">Loading session…</p>
            </>
          ) : isSuccess && result ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
              <p className="font-display text-lg font-semibold text-foreground">Attendance marked</p>
              <p className="font-body text-sm text-muted-foreground">
                You're marked as <strong>{result.status}</strong> for {session?.subject}.
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link to="/app/attendance/me">View my attendance</Link>
              </Button>
            </>
          ) : locating ? (
            <>
              <MapPin className="h-8 w-8 animate-pulse text-primary" aria-hidden="true" />
              <p className="font-body text-sm text-muted-foreground">
                Checking your real location — this session requires you to be present.
              </p>
            </>
          ) : locationError || error ? (
            <>
              <XCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
              <p className="font-body text-sm text-destructive">
                {locationError ?? (error as { message?: string })?.message ?? "Couldn't mark attendance."}
              </p>
              <Button asChild size="sm" variant="outline" className="mt-2">
                <Link to="/app/attendance/me">View my attendance</Link>
              </Button>
            </>
          ) : (
            <>
              <Spinner size="lg" />
              <p className="font-body text-sm text-muted-foreground">Marking your attendance…</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
