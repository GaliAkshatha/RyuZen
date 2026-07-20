import { z } from "zod";

export const CreatePlacementDriveSchema = z.object({

    companyId: z.string()

        .trim()

        .min(1, "Company id is required."),

    title: z.string()

        .trim()

        .min(1, "Title is required.")

        .max(200),

    description: z.string()

        .trim()

        .max(3000)

        .optional(),

    package: z.string()

        .trim()

        .max(100)

        .optional(),

    location: z.string()

        .trim()

        .max(200)

        .optional(),

    eligibility: z.string()

        .trim()

        .max(2000)

        .optional(),

    deadline: z.coerce.date()

        .optional()

});

export const UpdatePlacementDriveSchema = z.object({

    title: z.string()

        .trim()

        .min(1)

        .max(200)

        .optional(),

    description: z.string()

        .trim()

        .max(3000)

        .optional(),

    package: z.string()

        .trim()

        .max(100)

        .optional(),

    location: z.string()

        .trim()

        .max(200)

        .optional(),

    eligibility: z.string()

        .trim()

        .max(2000)

        .optional(),

    deadline: z.coerce.date()

        .optional()

});
