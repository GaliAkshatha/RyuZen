import { useState } from "react";
import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, ClipboardCheck } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Spinner } from "@/shared/components/Spinner";
import { useToast } from "@/hooks/useToast";
import { InterviewRoundType, InterviewRoundStatus } from "@/types/enums";

import { useInterviewRoundsForApplication } from "@/features/interview-rounds/hooks/useInterviewRoundsForApplication";
import { useScheduleInterviewRound } from "@/features/interview-rounds/hooks/useScheduleInterviewRound";
import { useRecordInterviewEvaluation } from "@/features/interview-rounds/hooks/useRecordInterviewEvaluation";
import {
  scheduleInterviewRoundSchema,
  evaluateInterviewRoundSchema,
  type ScheduleInterviewRoundFormValues,
  type EvaluateInterviewRoundFormValues,
} from "@/features/interview-rounds/schemas/interviewRound.schemas";
import type { InterviewRoundResponseDto } from "@/features/interview-rounds/types/interviewRound.types";

const ROUND_TYPES = [
  InterviewRoundType.ONLINE_ASSESSMENT,
  InterviewRoundType.TECHNICAL_1,
  InterviewRoundType.TECHNICAL_2,
  InterviewRoundType.MANAGERIAL,
  InterviewRoundType.HR,
];

const ROUND_LABELS: Record<InterviewRoundType, string> = {
  [InterviewRoundType.ONLINE_ASSESSMENT]: "Online Assessment",
  [InterviewRoundType.TECHNICAL_1]: "Technical Round 1",
  [InterviewRoundType.TECHNICAL_2]: "Technical Round 2",
  [InterviewRoundType.MANAGERIAL]: "Managerial Round",
  [InterviewRoundType.HR]: "HR Round",
};

function EvaluationForm({ round, applicationId }: { round: InterviewRoundResponseDto; applicationId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useRecordInterviewEvaluation(applicationId);

  const { register, handleSubmit, control } = useAppForm<EvaluateInterviewRoundFormValues>({
    resolver: zodResolver(evaluateInterviewRoundSchema),
    defaultValues: { passed: "true" },
  });

  function onSubmit(values: EvaluateInterviewRoundFormValues) {
    mutate(
      {
        id: round.id,
        payload: {
          passed: values.passed === "true",
          rating: values.rating,
          strengths: values.strengths,
          weaknesses: values.weaknesses,
          notes: values.notes,
        },
      },
      { onSuccess: () => toast({ title: "Evaluation recorded" }) },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 rounded-md bg-muted/40 p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Controller
          control={control}
          name="passed"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Outcome">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Passed</SelectItem>
                <SelectItem value="false">Failed</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Input type="number" min={1} max={10} placeholder="Rating (1-10)" {...register("rating")} />
      </div>
      <Textarea rows={2} placeholder="Strengths" {...register("strengths")} />
      <Textarea rows={2} placeholder="Weaknesses" {...register("weaknesses")} />
      <Textarea rows={2} placeholder="Notes" {...register("notes")} />
      <Button type="submit" size="sm" disabled={isPending} className="self-start">
        {isPending ? "Saving…" : "Record Evaluation"}
      </Button>
    </form>
  );
}

function RoundRow({ round, applicationId }: { round: InterviewRoundResponseDto; applicationId: string }) {
  const [evaluating, setEvaluating] = useState(false);
  const canEvaluate =
    round.status === InterviewRoundStatus.SCHEDULED || round.status === InterviewRoundStatus.COMPLETED;

  return (
    <li className="flex flex-col gap-2 rounded-md border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-body text-xs text-muted-foreground">Round {round.sequence}</span>
          <span className="font-body text-sm font-medium text-foreground">
            {ROUND_LABELS[round.roundType]}
          </span>
          <StatusBadge status={round.status} />
        </div>
        {canEvaluate && (
          <Button size="sm" variant="outline" onClick={() => setEvaluating((v) => !v)}>
            <ClipboardCheck className="mr-1 h-3 w-3" aria-hidden="true" />
            {evaluating ? "Cancel" : "Evaluate"}
          </Button>
        )}
      </div>

      {round.scheduledAt && (
        <p className="font-body text-xs text-muted-foreground">
          Scheduled for {new Date(round.scheduledAt).toLocaleString()}
        </p>
      )}

      {round.evaluation && (
        <div className="flex flex-col gap-1 font-body text-xs text-muted-foreground">
          {round.evaluation.rating !== undefined && <p>Rating: {round.evaluation.rating}/10</p>}
          {round.evaluation.strengths && <p>Strengths: {round.evaluation.strengths}</p>}
          {round.evaluation.weaknesses && <p>Weaknesses: {round.evaluation.weaknesses}</p>}
          {round.evaluation.notes && <p>Notes: {round.evaluation.notes}</p>}
        </div>
      )}

      {evaluating && <EvaluationForm round={round} applicationId={applicationId} />}
    </li>
  );
}

/**
 * The real multi-round lifecycle: Online Assessment -> Technical 1 ->
 * Technical 2 -> Managerial -> HR. Sequence numbers are computed
 * entirely server-side (ScheduleInterviewRoundUseCase) - never
 * guessed here, since a real drive might skip a round.
 */
export function InterviewRoundsPanel({ applicationId }: { applicationId: string }) {
  const { toast } = useToast();
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const { data: rounds, isLoading } = useInterviewRoundsForApplication(applicationId);
  const { mutate: schedule, isPending: isScheduling } = useScheduleInterviewRound(applicationId);

  const { register, handleSubmit, control, reset } = useAppForm<ScheduleInterviewRoundFormValues>({
    resolver: zodResolver(scheduleInterviewRoundSchema),
    defaultValues: { roundType: InterviewRoundType.ONLINE_ASSESSMENT },
  });

  function onSubmit(values: ScheduleInterviewRoundFormValues) {
    schedule(
      {
        applicationId,
        roundType: values.roundType,
        scheduledAt: values.scheduledAt || undefined,
        interviewerId: values.interviewerId || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Interview round scheduled" });
          setShowScheduleForm(false);
          reset();
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {rounds && rounds.length > 0 && (
        <ul className="flex flex-col gap-2">
          {rounds.map((round) => (
            <RoundRow key={round.id} round={round} applicationId={applicationId} />
          ))}
        </ul>
      )}

      {showScheduleForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 rounded-md border border-dashed border-border p-3"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Controller
              control={control}
              name="roundType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Round type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROUND_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ROUND_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Input type="datetime-local" {...register("scheduledAt")} />
            <Input placeholder="Interviewer user id (optional)" {...register("interviewerId")} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isScheduling}>
              {isScheduling ? "Scheduling…" : "Schedule"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowScheduleForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setShowScheduleForm(true)} className="self-start">
          <CalendarPlus className="mr-1 h-3 w-3" aria-hidden="true" />
          Schedule Round
        </Button>
      )}
    </div>
  );
}
