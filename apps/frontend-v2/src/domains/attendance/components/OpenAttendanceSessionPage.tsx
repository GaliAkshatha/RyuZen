import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { QrCode } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { useOpenAttendanceSession } from "@/domains/attendance/hooks/useAttendanceMutations";
import type { OpenAttendanceSessionRequest } from "@/domains/attendance/attendance.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real gap filled: the entire attendance domain (real signed rotating
 * QR-token sessions, GPS proximity checks, correction workflow,
 * anomaly detection - 9 real routes) existed on the backend with zero
 * frontend anywhere. This opens a session, then hands off to
 * AttendanceSessionPage for the real live token display + records
 * management.
 */
export function OpenAttendanceSessionPage() {
  const navigate = useNavigate();
  const { mutate: openSession, isPending, error } = useOpenAttendanceSession();
  const { register, handleSubmit } = useForm<{ subject: string; requireLocation: boolean }>();

  function onSubmit(values: { subject: string; requireLocation: boolean }) {
    const payload: OpenAttendanceSessionRequest = { subject: values.subject, requireLocation: values.requireLocation };
    openSession(payload, {
      onSuccess: (session) => navigate(`/faculty/attendance/${session.id}`),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Open a live session for students to mark their attendance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-primary" aria-hidden="true" />
            Open a new session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                {(error as AppApiError).message}
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="att-subject">Subject</Label>
              <Input id="att-subject" placeholder="Data Structures" {...register("subject", { required: true })} />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" {...register("requireLocation")} />
              Require students to be physically near me (GPS check)
            </label>
            <Button type="submit" size="sm" disabled={isPending} className="w-fit">
              {isPending ? "Opening…" : "Open session"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
