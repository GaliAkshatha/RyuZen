import { z } from "zod";

import { InterviewRoundType } from "../../domain/constants/InterviewRoundType.js";

export const ScheduleInterviewRoundSchema = z.object({

    applicationId: z.string().min(1),

    roundType: z.enum([

        InterviewRoundType.ONLINE_ASSESSMENT,
        InterviewRoundType.TECHNICAL_1,
        InterviewRoundType.TECHNICAL_2,
        InterviewRoundType.MANAGERIAL,
        InterviewRoundType.HR

    ]),

    scheduledAt: z.coerce.date().optional(),

    interviewerId: z.string().min(1).optional()

});
