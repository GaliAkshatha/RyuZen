import { z } from "zod";

export const SubmitEventFeedbackSchema = z.object({

    feedback: z.string()

        .trim()

        .min(1, "Feedback is required.")

        .max(1000)

});
