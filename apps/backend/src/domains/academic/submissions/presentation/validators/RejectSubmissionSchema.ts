import { z } from "zod";

export const RejectSubmissionSchema = z.object({

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

        )

});
