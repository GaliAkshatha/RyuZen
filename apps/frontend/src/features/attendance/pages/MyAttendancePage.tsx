import { useState } from "react";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useToast } from "@/hooks/useToast";
import { flattenApiErrors } from "@/utils/flattenApiErrors";

import { useMyAttendanceRecords } from "@/features/attendance/hooks/useMyAttendanceRecords";
import { AcademicLayout } from "@/features/academic-hub/components/AcademicLayout";
import { useRequestAttendanceCorrection } from "@/features/attendance/hooks/useRequestAttendanceCorrection";
import {
  requestCorrectionSchema,
  type RequestCorrectionFormValues,
} from "@/features/attendance/schemas/attendance.schemas";
import type { AttendanceRecordResponseDto } from "@/features/attendance/types/attendance.types";

export function MyAttendancePage() {
  const { toast } = useToast();
  const [showRequestForm, setShowRequestForm] = useState(false);

  const { data: records, isLoading, isError, error, refetch } = useMyAttendanceRecords();
  const { mutate, isPending, error: requestError } = useRequestAttendanceCorrection();

  const { register, handleSubmit, formState: { errors } } = useAppForm<RequestCorrectionFormValues>({
    resolver: zodResolver(requestCorrectionSchema),
    defaultValues: { sessionId: "", reason: "" },
  });

  function onSubmit(values: RequestCorrectionFormValues) {
    mutate(values, {
      onSuccess: () => {
        toast({ title: "Correction requested" });
        setShowRequestForm(false);
      },
    });
  }

  const columns: DataGridColumn<AttendanceRecordResponseDto>[] = [
    { key: "sessionId", header: "Session", render: (r) => r.sessionId },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "method", header: "Method", render: (r) => r.method },
    {
      key: "markedAt",
      header: "Marked",
      render: (r) => new Date(r.markedAt).toLocaleString(),
      sortable: true,
      sortValue: (r) => new Date(r.markedAt).getTime(),
    },
    {
      key: "correctionStatus",
      header: "Correction",
      render: (r) => (r.correctionStatus ? <StatusBadge status={r.correctionStatus} /> : "—"),
    },
  ];

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(requestError);

  if (isError) {
    return (
      <AcademicLayout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout>
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <CalendarCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          My Attendance
        </h1>
        <Button onClick={() => setShowRequestForm((v) => !v)}>
          {showRequestForm ? "Cancel" : "Request Correction"}
        </Button>
      </div>

      {showRequestForm && (
        <Card>
          <CardHeader>
            <CardTitle>Request a Correction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
              {(fieldErrors.length > 0 || apiErrors.length > 0) && (
                <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
              )}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sessionId" className="font-body text-sm text-foreground">
                  Session ID
                </label>
                <Input id="sessionId" {...register("sessionId")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reason" className="font-body text-sm text-foreground">
                  Reason (e.g. medical leave, technical issue during scan)
                </label>
                <Textarea id="reason" rows={3} {...register("reason")} />
              </div>
              <Button type="submit" disabled={isPending} className="self-start">
                {isPending ? "Submitting…" : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <DataGrid
        data={records ?? []}
        columns={columns}
        getRowId={(r) => r.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by session…"
        getSearchableText={(r) => r.sessionId}
        emptyTitle="No attendance records yet"
        emptyDescription="Sessions you've marked attendance for will appear here."
      />
    </div>
    </AcademicLayout>
  );
}
