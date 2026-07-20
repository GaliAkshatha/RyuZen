import { z } from "zod";

export const AnswerMockInterviewSchema = z.object({

    answer: z.string()

        .trim()

        .min(1, "An answer is required.")

        .max(5000)

});
