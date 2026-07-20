import { z } from "zod";

import { JobApplicationStatus } from "../../domain/constants/JobApplicationStatus.js";

export const UpdateJobApplicationStatusSchema = z.object({

    status: z.enum([

        JobApplicationStatus.APPLIED,

        JobApplicationStatus.SHORTLISTED,

        JobApplicationStatus.REJECTED,

        JobApplicationStatus.SELECTED

    ]),

    remarks: z.string()

        .trim()

        .max(1000)

        .optional()

});
