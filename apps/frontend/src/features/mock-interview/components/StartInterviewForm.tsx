import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  startMockInterviewSchema,
  type StartMockInterviewFormValues,
} from "@/features/mock-interview/schemas/mockInterview.schemas";

interface StartInterviewFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: StartMockInterviewFormValues) => void;
}

export function StartInterviewForm({ isSubmitting, error, onSubmit }: StartInterviewFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartMockInterviewFormValues>({
    resolver: zodResolver(startMockInterviewSchema),
    defaultValues: { role: "" },
  });

  const fieldErrors = errors.role ? [errors.role.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="font-body text-sm font-medium text-foreground">
          Target Role
        </label>
        <Input id="role" placeholder="e.g. Frontend Developer" {...register("role")} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="self-start">
        <Play className="mr-2 h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Starting…" : "Start Interview"}
      </Button>
    </form>
  );
}
