import { z } from "zod";

import { QuestionType } from "../../domain/constants/QuestionType.js";

export const AddAssessmentQuestionSchema = z.object({

    questionText: z.string().trim().min(1).max(2000),

    type: z.enum([QuestionType.MCQ_SINGLE, QuestionType.MCQ_MULTIPLE, QuestionType.TRUE_FALSE]),

    options: z.array(z.string().trim().min(1)).min(2).max(10),

    correctOptionIndexes: z.array(z.number().int().min(0)).min(1),

    marks: z.coerce.number().min(1).max(100)

});
