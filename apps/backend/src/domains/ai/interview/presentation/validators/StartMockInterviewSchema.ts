import { z } from "zod";

export const StartMockInterviewSchema = z.object({

    role: z.string()

        .trim()

        .min(1, "A target role is required.")

        .max(150),

    /**
     * Real bounds, not arbitrary - under 5 minutes isn't enough time
     * for 5 real questions, and over 60 stops resembling an actual
     * interview slot. Defaults to 20, a reasonable real interview
     * length for 5 questions.
     */
    durationMinutes: z.number()

        .int()

        .min(5, "The interview must run for at least 5 minutes.")

        .max(60, "The interview can run for at most 60 minutes.")

        .optional()

        .default(20)

});
