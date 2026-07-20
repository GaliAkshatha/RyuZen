import { z } from "zod";

export const CreateEducationSchema = z.object({

    institution: z.string()

        .trim()

        .min(1, "Institution is required.")

        .max(200),

    degree: z.string()

        .trim()

        .min(1, "Degree is required.")

        .max(150),

    branch: z.string()

        .trim()

        .max(150)

        .optional(),

    cgpa: z.number()

        .min(0)

        .max(10)

        .optional(),

    startYear: z.number()

        .min(1950)

        .max(2100),

    endYear: z.number()

        .min(1950)

        .max(2100)

        .optional()

});

export const UpdateEducationSchema = z.object({

    institution: z.string()

        .trim()

        .min(1)

        .max(200)

        .optional(),

    degree: z.string()

        .trim()

        .min(1)

        .max(150)

        .optional(),

    branch: z.string()

        .trim()

        .max(150)

        .optional(),

    cgpa: z.number()

        .min(0)

        .max(10)

        .optional(),

    startYear: z.number()

        .min(1950)

        .max(2100)

        .optional(),

    endYear: z.number()

        .min(1950)

        .max(2100)

        .optional()

});
