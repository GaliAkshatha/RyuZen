import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, CheckCircle2, GraduationCap, Send } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuth } from "@/domains/auth/AuthContext";
import { useEvent } from "@/domains/events/hooks/useEvent";
import { useEventRegistrations } from "@/domains/events/hooks/useEventRegistrations";
import {
  usePublishEvent,
  useRegisterForEvent,
  useMarkEventAttendance,
  useSubmitEventFeedback,
  useIssueEventCertificates,
} from "@/domains/events/hooks/useEventMutations";
import { EventStatus } from "@/domains/events/event.types";

const CAN_MANAGE_ROLES = ["SUPER_ADMIN", "ORG_ADMIN", "FACULTY"];

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: event, isLoading, isError, error, refetch } = useEvent(id ?? "");
  const { data: registrations } = useEventRegistrations(id ?? "");
  const { mutate: publish, isPending: isPublishing } = usePublishEvent(id ?? "");
  const { mutate: register, isPending: isRegistering } = useRegisterForEvent(id ?? "");
  const { mutate: markAttendance } = useMarkEventAttendance(id ?? "");
  const { mutate: submitFeedback, isPending: isSubmittingFeedback } = useSubmitEventFeedback(id ?? "");
  const { mutate: issueCertificates, isPending: isIssuing } = useIssueEventCertificates(id ?? "");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const { register: registerFeedback, handleSubmit } = useForm<{ feedback: string }>();

  const canManage = Boolean(user?.role && CAN_MANAGE_ROLES.includes(user.role));
  const isStudent = user?.role === "STUDENT";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !event) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  function onSubmitFeedback(values: { feedback: string }) {
    submitFeedback(values, { onSuccess: () => setFeedbackSent(true) });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          to={isStudent ? "/student/events" : "/faculty/events"}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{event.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(event.startDate).toLocaleString()} {event.venue && `· ${event.venue}`}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-6">
          <p className="text-sm text-foreground">{event.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{event.points} pts</span>
            {event.capacity && <span>Capacity: {event.capacity}</span>}
            {event.certificateEnabled && <span>Certificate on attendance</span>}
          </div>

          {canManage && event.status === EventStatus.DRAFT && (
            <Button size="sm" disabled={isPublishing} onClick={() => publish()} className="w-fit">
              {isPublishing ? "Publishing…" : "Publish event"}
            </Button>
          )}

          {isStudent && event.status === EventStatus.PUBLISHED && (
            <Button size="sm" disabled={isRegistering} onClick={() => register()} className="w-fit">
              {isRegistering ? "Registering…" : "Register for this event"}
            </Button>
          )}
        </CardContent>
      </Card>

      {isStudent && event.status === EventStatus.COMPLETED && !feedbackSent && (
        <Card>
          <CardHeader>
            <CardTitle>Share your feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitFeedback)} className="flex items-center gap-2" noValidate>
              <textarea
                rows={2}
                className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...registerFeedback("feedback", { required: true })}
              />
              <Button type="submit" size="sm" disabled={isSubmittingFeedback} className="flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Registrations ({registrations?.length ?? 0})
              {event.certificateEnabled && (
                <Button size="sm" variant="outline" disabled={isIssuing} onClick={() => issueCertificates()} className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                  {isIssuing ? "Issuing…" : "Issue certificates to attendees"}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!registrations || registrations.length === 0 ? (
              <EmptyState title="No registrations yet" />
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {registrations.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <span className="font-mono text-xs text-foreground">{reg.studentId}</span>
                      {reg.certificateIssued && (
                        <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">Certificate issued</span>
                      )}
                    </div>
                    <button
                      onClick={() => markAttendance({ studentId: reg.studentId, attended: !reg.attendance })}
                      className={`flex items-center gap-1 text-xs font-medium ${reg.attendance ? "text-success" : "text-muted-foreground"}`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {reg.attendance ? "Attended" : "Mark attended"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
