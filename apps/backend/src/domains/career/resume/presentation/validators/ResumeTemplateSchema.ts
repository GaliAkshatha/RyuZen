import { z } from "zod";

export const CreateResumeTemplateSchema = z.object({

    name: z.string()

        .trim()

        .min(1, "Name is required.")

        .max(100),

    thumbnail: z.string()

        .trim()

        .url("Invalid thumbnail URL.")

        .optional(),

    templateFile: z.string()

        .trim()

        .url("Invalid template file URL.")

        .optional(),

    premium: z.boolean()

        .optional()

});

export const UpdateResumeTemplateSchema = z.object({

    name: z.string()

        .trim()

        .min(1)

        .max(100)

        .optional(),

    thumbnail: z.string()

        .trim()

        .url("Invalid thumbnail URL.")

        .optional(),

    templateFile: z.string()

        .trim()

        .url("Invalid template file URL.")

        .optional(),

    premium: z.boolean()

        .optional()

});
