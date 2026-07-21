import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import { sendAIChatMessageSchema } from "@/features/ai-chat/schemas/aiChat.schemas";

interface AIChatComposerProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  showContextField: boolean;
  onSubmit: (values: { message: string; context?: string }) => void;
}

const composerSchema = sendAIChatMessageSchema.pick({ message: true, context: true });

export function AIChatComposer({
  isSubmitting,
  error,
  showContextField,
  onSubmit,
}: AIChatComposerProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ message: string; context?: string }>({
    resolver: zodResolver(composerSchema),
    defaultValues: { message: "", context: "" },
  });

  const fieldErrors = errors.message ? [errors.message.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit({
          message: values.message,
          context: values.context?.trim() ? values.context.trim() : undefined,
        });
        reset({ message: "", context: values.context });
      })}
      className="flex flex-col gap-2"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}
      {showContextField && (
        <Input placeholder="Topic (optional, e.g. resume, interview)" {...register("context")} />
      )}
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Ask the AI assistant…"
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
