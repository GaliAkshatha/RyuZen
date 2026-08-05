import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";
import { NotificationAudience, NotificationType } from "@/types/enums";

import {
  sendNotificationSchema,
  type SendNotificationFormValues,
} from "@/features/notifications/schemas/notification.schemas";

interface SendNotificationFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: SendNotificationFormValues) => void;
}

const TYPES = [
  NotificationType.ANNOUNCEMENT,
  NotificationType.ALERT,
  NotificationType.INFO,
  NotificationType.REMINDER,
];

const AUDIENCES = [
  NotificationAudience.ALL,
  NotificationAudience.ORG_ADMIN,
  NotificationAudience.FACULTY,
  NotificationAudience.STUDENT,
  NotificationAudience.ALUMNI,
];

export function SendNotificationForm({ isSubmitting, error, onSubmit }: SendNotificationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: { title: "", message: "" },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="font-body text-sm font-medium text-foreground">
          Title
        </label>
        <Input id="title" aria-invalid={Boolean(errors.title)} {...register("title")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-body text-sm font-medium text-foreground">
          Message
        </label>
        <Textarea
          id="message"
          rows={3}
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-sm font-medium text-foreground">Type (optional)</label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Select type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {humanizeEnumValue(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-sm font-medium text-foreground">
            Audience (optional)
          </label>
          <Controller
            control={control}
            name="targetAudience"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Select audience">
                  <SelectValue placeholder="All (default)" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {humanizeEnumValue(audience)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Sending…" : "Send Notification"}
      </Button>
    </form>
  );
}
