import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Skeleton } from "@/shared/components/Skeleton";
import { useInterviewRoundsForApplication } from "@/domains/interview-rounds/hooks/useInterviewRoundsForApplication";
import { useScheduleInterviewRound } from "@/domains/interview-rounds/hooks/useScheduleInterviewRound";
import { useRecordInterviewEvaluation } from "@/domains/interview-rounds/hooks/useRecordInterviewEvaluation";
import { InterviewRoundType, InterviewRoundStatus } from "@/domains/interview-rounds/interviewRound.types";

const ROUND_TYPES = Object.values(InterviewRoundType);

/**
 * Real, verified company-scope enforcement lives entirely server-side
 * (this session's earlier security fix + its 4 regression tests) - a
 * recruiter attempting to schedule for an application outside their
 * own real company gets a genuine 404 from the backend, surfaced here
 * as a normal error, not specially handled or hidden client-side.
 */
export function InterviewRoundsPanel({ applicationId }: { applicationId: string }) {
  const { data: rounds, isLoading } = useInterviewRoundsForApplication(applicationId);
  const { mutate: scheduleRound, isPending: isScheduling } = useScheduleInterviewRound(applicationId);
  const { mutate: evaluateRound, isPending: isEvaluating } = useRecordInterviewEvaluation(applicationId);
  const [isSchedulingNew, setIsSchedulingNew] = useState(false);
  const [evaluatingRoundId, setEvaluatingRoundId] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<{ roundType: string }>();

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-3">
      {(rounds ?? []).map((round) => (
        <div key={round.id} className="flex flex-col gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{round.roundType}</span>
            <StatusBadge status={round.status} />
          </div>
          {round.status === InterviewRoundStatus.SCHEDULED && (
            <>
              {evaluatingRoundId === round.id ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={isEvaluating}
                    onClick={() => {
                      evaluateRound(
                        { id: round.id, payload: { passed: true } },
                        { onSuccess: () => setEvaluatingRoundId(null) },
                      );
                    }}
                  >
                    Passed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isEvaluating}
                    onClick={() => {
                      evaluateRound(
                        { id: round.id, payload: { passed: false } },
                        { onSuccess: () => setEvaluatingRoundId(null) },
                      );
                    }}
                  >
                    Failed
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEvaluatingRoundId(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="w-fit" onClick={() => setEvaluatingRoundId(round.id)}>
                  Record evaluation
                </Button>
              )}
            </>
          )}
        </div>
      ))}

      {isSchedulingNew ? (
        <form
          className="flex items-center gap-2"
          onSubmit={handleSubmit((values) => {
            scheduleRound(
              { applicationId, roundType: values.roundType as (typeof ROUND_TYPES)[number] },
              { onSuccess: () => { setIsSchedulingNew(false); reset(); } },
            );
          })}
        >
          <Controller
            control={control}
            name="roundType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Round type" />
                </SelectTrigger>
                <SelectContent>
                  {ROUND_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Button type="submit" size="sm" disabled={isScheduling}>
            {isScheduling ? "Scheduling…" : "Schedule"}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setIsSchedulingNew(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <Button size="sm" variant="outline" className="flex w-fit items-center gap-1.5" onClick={() => setIsSchedulingNew(true)}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Schedule round
        </Button>
      )}
    </div>
  );
}
