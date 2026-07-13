import { z } from "zod";

export const AssignMentorSchema = z.object({

    facultyId: z.string()

        .trim()

        .min(1, "Faculty id is required.")

});
