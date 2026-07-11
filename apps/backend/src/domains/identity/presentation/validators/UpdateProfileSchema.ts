import { z } from "zod";

export const UpdateProfileSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .optional(),

    profile: z.object({

        image: z
            .string()
            .trim()
            .max(500)
            .optional(),

        phone: z
            .string()
            .trim()
            .max(20)
            .optional(),

        bio: z
            .string()
            .trim()
            .max(300)
            .optional()

    }).optional()

});
