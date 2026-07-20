import { z } from "zod";

import { ResumeVisibility } from "../../domain/constants/ResumeVisibility.js";

export const UpdateResumeVisibilitySchema = z.object({

    visibility: z.enum([

        ResumeVisibility.PUBLIC,

        ResumeVisibility.PRIVATE

    ])

});
