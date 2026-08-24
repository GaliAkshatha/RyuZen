import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Check } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { useAuth } from "@/domains/auth/AuthContext";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";
import { useSendNotification } from "@/domains/notifications/hooks/useSendNotification";
import { sendNotificationSchema, type SendNotificationFormValues } from "@/domains/notifications/notificationSchema";
import { NotificationAudience } from "@/domains/notifications/notification.types";
import { ALLOWED_AUDIENCES } from "@/domains/notifications/canComposeNotifications";
import type { AppApiError } from "@/shared/types/api.types";

const AUDIENCE_LABELS: Record<NotificationAudience, string> = {
  ALL: "Everyone in my organization",
  ORG_ADMIN: "Org Admins",
  FACULTY: "Faculty",
  STUDENT: "Students",
  ALUMNI: "Alumni",
};

/**
 * Real, role-aware compose form - the exact same per-role audience
 * rule this whole form matches was confirmed directly against
 * ALLOWED_AUDIENCES_BY_ROLE in the real backend SendNotificationUseCase,
 * not guessed at independently. A role with no allowed audiences at
 * all (anyone but SUPER_ADMIN/ORG_ADMIN/FACULTY) never sees this
 * form - callers check canComposeNotifications() before rendering it.
 */
export function ComposeNotificationForm({ onSent }: { onSent?: () => void }) {
  const { user } = useAuth();
  const { data: departments } = useDepartments();
  const { mutate: sendNotification, isPending } = useSendNotification();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);
  const [success, setSuccess] = useState(false);

  const allowedAudiences = ALLOWED_AUDIENCES[user?.role ?? ""] ?? [];

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: { targetAudience: allowedAudiences[0] },
  });

  const selectedAudience = watch("targetAudience");
  const canTargetDepartments = selectedAudience === NotificationAudience.STUDENT || selectedAudience === NotificationAudience.FACULTY;

  function onSubmit(values: SendNotificationFormValues) {
    setSubmitError(null);
    setSuccess(false);
    sendNotification(
      { ...values, departmentIds: canTargetDepartments ? values.departmentIds : undefined },
      {
        onSuccess: () => {
          setSuccess(true);
          reset({ targetAudience: allowedAudiences[0] });
          onSent?.();
        },
        onError: (err) => setSubmitError(err),
      },
    );
  }

  if (allowedAudiences.length === 0) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">{submitError.message}</p>
      )}
      {success && (
        <p className="flex items-center gap-1.5 rounded-md border border-success/30 bg-success/5 p-2.5 text-xs text-success">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Notification sent
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notif-title">Title</Label>
        <Input id="notif-title" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notif-message">Message</Label>
        <Input id="notif-message" {...register("message")} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Send to</Label>
        <Controller
          control={control}
          name="targetAudience"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedAudiences.map((audience) => (
                  <SelectItem key={audience} value={audience}>
                    {AUDIENCE_LABELS[audience]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {canTargetDepartments && (
        <div className="flex flex-col gap-1.5">
          <Label>Department (optional — leave unset to reach everyone in this audience)</Label>
          <Controller
            control={control}
            name="departmentIds"
            render={({ field }) => (
              <Select value={field.value?.[0]} onValueChange={(v) => field.onChange(v ? [v] : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any department" />
                </SelectTrigger>
                <SelectContent>
                  {(departments ?? []).map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <Button type="submit" size="sm" disabled={isPending} className="mt-1 flex w-fit items-center gap-1.5">
        <Send className="h-3.5 w-3.5" aria-hidden="true" />
        {isPending ? "Sending…" : "Send notification"}
      </Button>
    </form>
  );
}
