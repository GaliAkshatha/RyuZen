import { z } from "zod";

export const UpdateAlumniSchema = z.object({

    name: z.string()

        .trim()

        .min(2)

        .max(100)

        .optional(),

    graduationYear: z.number()

        .min(1950)

        .max(2100)

        .optional(),

    company: z.string()

        .trim()

        .max(150)

        .optional(),

    designation: z.string()

        .trim()

        .max(150)

        .optional()

});
