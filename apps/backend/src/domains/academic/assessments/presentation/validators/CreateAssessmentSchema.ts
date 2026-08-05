import { z } from "zod";

import { AssessmentType } from "../../domain/constants/AssessmentType.js";

export const CreateAssessmentSchema = z.object({

    title: z.string().trim().min(1).max(200),

    description: z.string().trim().max(2000).optional(),

    type: z.enum([

        AssessmentType.APTITUDE,
        AssessmentType.BRANCH_SPECIFIC,
        AssessmentType.WEEKLY,
        AssessmentType.COMPANY_SPECIFIC

    ]),

    departmentId: z.string().min(1).optional(),

    durationMinutes: z.coerce.number().int().min(1).max(600),

    passingScore: z.coerce.number().min(0).optional(),

    startsAt: z.coerce.date().optional(),

    endsAt: z.coerce.date().optional()

});
