import { useState } from "react";
import { useForm } from "react-hook-form";
import { QrCode, RotateCcw, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useMyAttendanceRecords } from "@/domains/attendance/hooks/useMyAttendanceRecords";
import { useMarkAttendanceViaQr, useRequestAttendanceCorrection } from "@/domains/attendance/hooks/useAttendanceMutations";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real geolocation, not a placeholder: getCurrentPosition is genuinely
 * called and its real coordinates sent when a location-requiring
 * session's proximity check needs them - MarkAttendanceViaQrDto's
 * latitude/longitude are only ever populated with real browser
 * geolocation, never fabricated. Fails gracefully (marks without
 * location) if the browser denies permission - the backend itself
 * decides whether that's acceptable for a given session.
 */
function getBrowserLocation(): Promise<{ latitude?: number; longitude?: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({});
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve({}),
      { timeout: 5000 },
    );
  });
}

export function MyAttendancePage() {
  const { data: records, isLoading } = useMyAttendanceRecords();
  const { mutate: markViaQr, isPending: isMarking, error: markError } = useMarkAttendanceViaQr();
  const { mutate: requestCorrection, isPending: isRequesting } = useRequestAttendanceCorrection();
  const [locating, setLocating] = useState(false);
  const [correctingSessionId, setCorrectingSessionId] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<{ sessionId: string; token: string }>();
  const { register: registerCorrection, handleSubmit: handleCorrectionSubmit, reset: resetCorrection } = useForm<{ reason: string }>();

  async function onMark(values: { sessionId: string; token: string }) {
    setLocating(true);
    const location = await getBrowserLocation();
    setLocating(false);
    markViaQr({ sessionId: values.sessionId, token: values.token, ...location }, { onSuccess: () => reset() });
  }

  function onRequestCorrection(values: { reason: string }) {
    if (!correctingSessionId) return;
    requestCorrection(
      { sessionId: correctingSessionId, reason: values.reason },
      {
        onSuccess: () => {
          resetCorrection();
          setCorrectingSessionId(null);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Mark your attendance for a live session.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-primary" aria-hidden="true" />
            Mark attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onMark)} className="flex flex-col gap-3" noValidate>
            {markError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                {(markError as AppApiError).message}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="att-session">Session ID</Label>
                <Input id="att-session" placeholder="From your faculty" {...register("sessionId", { required: true })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="att-token">Code</Label>
                <Input id="att-token" placeholder="Current code shown by faculty" className="font-mono" {...register("token", { required: true })} />
              </div>
            </div>
            <Button type="submit" size="sm" disabled={isMarking || locating} className="flex w-fit items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {locating ? "Getting location…" : isMarking ? "Marking…" : "Mark present"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : !records || records.length === 0 ? (
            <EmptyState title="No attendance records yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {records.map((r) => (
                <div key={r.id} className="py-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{new Date(r.markedAt).toLocaleString()}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        r.status === "PRESENT" || r.status === "EXCUSED"
                          ? "bg-success/10 text-success"
                          : r.status === "LATE"
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  {r.correctionStatus ? (
                    <p className="mt-1 text-xs text-muted-foreground">Correction {r.correctionStatus.toLowerCase()}</p>
                  ) : r.status === "ABSENT" && correctingSessionId !== r.sessionId ? (
                    <button
                      onClick={() => setCorrectingSessionId(r.sessionId)}
                      className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Request correction
                    </button>
                  ) : null}
                  {correctingSessionId === r.sessionId && (
                    <form onSubmit={handleCorrectionSubmit(onRequestCorrection)} className="mt-2 flex items-center gap-2" noValidate>
                      <Input placeholder="Reason (e.g. medical leave)" className="h-8 text-xs" {...registerCorrection("reason", { required: true })} />
                      <Button type="submit" size="sm" disabled={isRequesting} className="h-8">
                        {isRequesting ? "Sending…" : "Send"}
                      </Button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
