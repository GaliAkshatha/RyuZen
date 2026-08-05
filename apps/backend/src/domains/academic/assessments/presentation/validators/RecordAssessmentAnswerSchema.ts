import { z } from "zod";

export const RecordAssessmentAnswerSchema = z.object({

    questionId: z.string().min(1),

    selectedOptionIndexes: z.array(z.number().int().min(0))

});
