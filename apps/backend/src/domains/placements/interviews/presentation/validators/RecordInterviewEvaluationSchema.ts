import { z } from "zod";

export const RecordInterviewEvaluationSchema = z.object({

    passed: z.boolean(),

    rating: z.number().min(1).max(10).optional(),

    strengths: z.string().trim().max(2000).optional(),

    weaknesses: z.string().trim().max(2000).optional(),

    notes: z.string().trim().max(2000).optional()

});
