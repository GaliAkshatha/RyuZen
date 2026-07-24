import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  adjustLeaderboardPointsSchema,
  type AdjustLeaderboardPointsFormValues,
} from "@/features/leaderboard/schemas/leaderboard.schemas";
import type { LeaderboardEntryResponseDto } from "@/features/leaderboard/types/leaderboard.types";

interface AdjustPointsFormProps {
  entry: LeaderboardEntryResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: AdjustLeaderboardPointsFormValues) => void;
}

/**
 * Only clubPoints and placementPoints are shown — AdjustLeaderboardPointsDto
 * has no activityPoints/eventPoints field at all, confirmed this
 * milestone. Those are read-only, auto-derived from approved
 * submissions (AC2) and attended events (C3) respectively.
 */
export function AdjustPointsForm({ entry, isSubmitting, error, onSubmit }: AdjustPointsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<AdjustLeaderboardPointsFormValues>({
    resolver: zodResolver(adjustLeaderboardPointsSchema),
    defaultValues: { clubPoints: entry.clubPoints, placementPoints: entry.placementPoints },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="clubPoints" className="font-body text-sm font-medium text-foreground">
          Club Points
        </label>
        <Input id="clubPoints" type="number" min={0} {...register("clubPoints")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="placementPoints" className="font-body text-sm font-medium text-foreground">
          Placement Points
        </label>
        <Input id="placementPoints" type="number" min={0} {...register("placementPoints")} />
      </div>

      <p className="font-body text-xs text-muted-foreground">
        Activity points ({entry.activityPoints}) and event points ({entry.eventPoints}) are
        calculated automatically and can't be adjusted here.
      </p>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Saving…" : "Save Adjustment"}
      </Button>
    </form>
  );
}
