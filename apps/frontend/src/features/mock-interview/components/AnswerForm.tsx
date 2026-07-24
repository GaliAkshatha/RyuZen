import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  answerMockInterviewSchema,
  type AnswerMockInterviewFormValues,
} from "@/features/mock-interview/schemas/mockInterview.schemas";

interface AnswerFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AnswerMockInterviewFormValues) => void;
}

export function AnswerForm({ isSubmitting, error, onSubmit }: AnswerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<AnswerMockInterviewFormValues>({
    resolver: zodResolver(answerMockInterviewSchema),
    defaultValues: { answer: "" },
  });

  const fieldErrors = errors.answer ? [errors.answer.message ?? "Invalid value."] : [];
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
      <Textarea
        placeholder="Type your answer…"
        rows={4}
        aria-label="Answer"
        {...register("answer")}
      />
      <Button type="submit" disabled={isSubmitting} className="self-start">
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Submitting…" : "Submit Answer"}
      </Button>
    </form>
  );
}
