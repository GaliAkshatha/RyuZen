import { z } from "zod";

/** Mirrors AdjustLeaderboardPointsSchema exactly — only clubPoints and placementPoints, both optional */
export const adjustLeaderboardPointsSchema = z.object({
  clubPoints: z.coerce.number().min(0, "Club points cannot be negative.").optional(),
  placementPoints: z.coerce.number().min(0, "Placement points cannot be negative.").optional(),
});

export type AdjustLeaderboardPointsFormValues = z.infer<typeof adjustLeaderboardPointsSchema>;
