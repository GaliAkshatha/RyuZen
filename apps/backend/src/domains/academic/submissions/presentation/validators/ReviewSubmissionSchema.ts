import { z } from "zod";

import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

export const ReviewSubmissionSchema = z.object({

    status:

        z.enum([

            SubmissionStatus.APPROVED,

            SubmissionStatus.REJECTED

        ]),

    feedback:

        z.string()

        .trim()

        .min(

            1,

            "Feedback is required."

        )

        .max(

            1000,

            "Feedback cannot exceed 1000 characters."

        ),

    pointsAwarded:

        z.number()

        .int()

        .min(

            0,

            "Points cannot be negative."

        )

});