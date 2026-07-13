import { z } from "zod";

export const UpdateClubSchema = z.object({

    name: z.string()

        .trim()

        .min(2)

        .max(150)

        .optional(),

    description: z.string()

        .trim()

        .max(1000)

        .optional(),

    logo: z.string()

        .trim()

        .max(500)

        .optional()

});
