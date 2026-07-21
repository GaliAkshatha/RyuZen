import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  sendMessageSchema,
  type SendMessageFormValues,
} from "@/features/chat/schemas/chat.schemas";

interface MessageComposerProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: SendMessageFormValues) => void;
}

export function MessageComposer({ isSubmitting, error, onSubmit }: MessageComposerProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { message: "" },
  });

  const fieldErrors = errors.message ? [errors.message.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        reset();
      })}
      className="flex flex-col gap-2"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Type a message…"
          rows={2}
          className="flex-1"
          aria-label="Message"
          {...register("message")}
        />
        <Button type="submit" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
