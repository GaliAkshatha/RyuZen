import { z } from "zod";

export const StartMockInterviewSchema = z.object({

    role: z.string()

        .trim()

        .min(1, "A target role is required.")

        .max(150)

});
