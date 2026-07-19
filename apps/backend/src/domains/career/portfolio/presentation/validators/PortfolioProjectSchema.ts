import { z } from "zod";

export const CreatePortfolioProjectSchema = z.object({

    title: z.string()

        .trim()

        .min(1, "Title is required.")

        .max(150),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    techStack: z.array(

        z.string().trim()

    )

        .optional(),

    github: z.string()

        .trim()

        .url("Invalid GitHub URL.")

        .optional(),

    liveDemo: z.string()

        .trim()

        .url("Invalid live demo URL.")

        .optional(),

    images: z.array(

        z.string().trim().url("Invalid image URL.")

    )

        .optional(),

    video: z.string()

        .trim()

        .url("Invalid video URL.")

        .optional(),

    featured: z.boolean()

        .optional()

});

export const UpdatePortfolioProjectSchema = z.object({

    title: z.string()

        .trim()

        .min(1)

        .max(150)

        .optional(),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    techStack: z.array(

        z.string().trim()

    )

        .optional(),

    github: z.string()

        .trim()

        .url("Invalid GitHub URL.")

        .optional(),

    liveDemo: z.string()

        .trim()

        .url("Invalid live demo URL.")

        .optional(),

    images: z.array(

        z.string().trim().url("Invalid image URL.")

    )

        .optional(),

    video: z.string()

        .trim()

        .url("Invalid video URL.")

        .optional(),

    featured: z.boolean()

        .optional()

});
