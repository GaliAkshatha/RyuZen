import { z } from "zod";

export const ApproveSubmissionSchema = z.object({

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
