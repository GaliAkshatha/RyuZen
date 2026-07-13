import { z } from "zod";

export const AdjustLeaderboardPointsSchema = z.object({

    clubPoints: z.number()

        .min(0)

        .optional(),

    placementPoints: z.number()

        .min(0)

        .optional()

});
