import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, QrCode } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { flattenApiErrors } from "@/utils/flattenApiErrors";

import { AcademicLayout } from "@/features/academic-hub/components/AcademicLayout";

import { useOpenAttendanceSession } from "@/features/attendance/hooks/useOpenAttendanceSession";
import {
  openAttendanceSessionSchema,
  type OpenAttendanceSessionFormValues,
} from "@/features/attendance/schemas/attendance.schemas";

/**
 * Opening a session is the real starting point of the whole rotating-
 * QR + GPS flow — everything a student does afterward is validated
 * against exactly what's set here.
 */
export function OpenAttendanceSessionPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useOpenAttendanceSession();
  const [locatingDevice, setLocatingDevice] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useAppForm<OpenAttendanceSessionFormValues>({
    resolver: zodResolver(openAttendanceSessionSchema),
    defaultValues: { requireLocation: false, qrRotationSeconds: 20, windowMinutes: 15 },
  });

  const requireLocation = watch("requireLocation");

  function captureCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't available in this browser.");
      return;
    }
    setLocatingDevice(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude);
        setValue("longitude", position.coords.longitude);
        setLocatingDevice(false);
      },
      () => {
        setLocationError("Couldn't get your real location — check browser permissions.");
        setLocatingDevice(false);
      },
    );
  }

  function onSubmit(values: OpenAttendanceSessionFormValues) {
    mutate(values, {
      onSuccess: (session) => navigate(`/app/attendance/sessions/${session.id}`),
    });
  }

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <AcademicLayout>
    <div className="relative flex max-w-2xl flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <QrCode className="h-6 w-6 text-primary" aria-hidden="true" />
        Open Attendance Session
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {(fieldErrors.length > 0 || apiErrors.length > 0 || locationError) && (
              <FormErrorSummary
                errors={[...fieldErrors, ...apiErrors, ...(locationError ? [locationError] : [])]}
              />
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="font-body text-sm font-medium text-foreground">
                Subject
              </label>
              <Input id="subject" {...register("subject")} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="qrRotationSeconds" className="font-body text-sm text-foreground">
                  QR Rotation (seconds)
                </label>
                <Input id="qrRotationSeconds" type="number" min={5} max={300} {...register("qrRotationSeconds")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="windowMinutes" className="font-body text-sm text-foreground">
                  Session Window (minutes)
                </label>
                <Input id="windowMinutes" type="number" min={1} max={300} {...register("windowMinutes")} />
              </div>
            </div>

            <label className="flex items-center gap-2 font-body text-sm text-foreground">
              <Checkbox
                checked={requireLocation}
                onCheckedChange={(checked) => setValue("requireLocation", Boolean(checked))}
              />
              Require students to be physically within range (GPS)
            </label>

            {requireLocation && (
              <div className="flex flex-col gap-3 rounded-md border border-border p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={captureCurrentLocation}
                  disabled={locatingDevice}
                  className="w-fit"
                >
                  <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                  {locatingDevice ? "Locating…" : "Use My Current Location"}
                </Button>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input type="number" step="any" placeholder="Latitude" {...register("latitude")} />
                  <Input type="number" step="any" placeholder="Longitude" {...register("longitude")} />
                  <Input type="number" placeholder="Radius (meters)" {...register("radiusMeters")} />
                </div>
              </div>
            )}

            <Button type="submit" disabled={isPending} className="self-start">
              {isPending ? "Opening…" : "Open Session"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </AcademicLayout>
  );
}
