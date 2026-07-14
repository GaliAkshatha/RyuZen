import { z } from "zod";

export const CreateBadgeSchema = z.object({

    name: z.string()

        .trim()

        .min(2)

        .max(100),

    description: z.string()

        .trim()

        .max(500)

        .optional(),

    icon: z.string()

        .trim()

        .max(500)

        .optional(),

    criteria: z.string()

        .trim()

        .max(500)

        .optional(),

    points: z.number()

        .min(0)

        .optional()

});
