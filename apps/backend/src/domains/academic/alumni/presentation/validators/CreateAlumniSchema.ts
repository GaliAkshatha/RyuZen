import { z } from "zod";

export const CreateAlumniSchema = z.object({

    userId: z.string()

        .trim()

        .min(1, "User id is required."),

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
