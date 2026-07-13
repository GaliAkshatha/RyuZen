import { z } from "zod";

export const UpdateStudentSchema = z.object({

    usn: z.string()

        .trim()

        .min(2)

        .optional(),

    batch: z.string()

        .trim()

        .min(2)

        .optional(),

    cgpa: z.number()

        .min(0)

        .max(10)

        .optional()

});
