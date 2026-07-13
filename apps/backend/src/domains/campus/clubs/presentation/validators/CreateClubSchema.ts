import { z } from "zod";

export const CreateClubSchema = z.object({

    name: z.string()

        .trim()

        .min(2)

        .max(150),

    code: z.string()

        .trim()

        .min(2)

        .max(20),

    description: z.string()

        .trim()

        .max(1000)

        .optional(),

    logo: z.string()

        .trim()

        .max(500)

        .optional(),

    facultyAdvisorId: z.string()

        .trim()

        .min(1)

        .optional()

});
