import { z } from "zod";

export const AwardBadgeSchema = z.object({

    studentId: z.string()

        .trim()

        .min(1, "Student id is required.")

});
