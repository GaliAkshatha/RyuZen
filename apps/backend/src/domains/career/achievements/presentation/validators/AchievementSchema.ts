import { z } from "zod";

import { AchievementLevel } from "../../domain/constants/AchievementLevel.js";

export const CreateAchievementSchema = z.object({

    title: z.string()

        .trim()

        .min(1, "Title is required.")

        .max(200),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    category: z.string()

        .trim()

        .max(100)

        .optional(),

    level: z.enum([

        AchievementLevel.COLLEGE,

        AchievementLevel.STATE,

        AchievementLevel.NATIONAL,

        AchievementLevel.INTERNATIONAL

    ])

        .optional(),

    position: z.string()

        .trim()

        .max(100)

        .optional(),

    certificateUrl: z.string()

        .trim()

        .url("Invalid certificate URL.")

        .optional(),

    proofUrl: z.string()

        .trim()

        .url("Invalid proof URL.")

        .optional(),

    achievementDate: z.coerce.date()

});

export const UpdateAchievementSchema = z.object({

    title: z.string()

        .trim()

        .min(1)

        .max(200)

        .optional(),

    description: z.string()

        .trim()

        .max(2000)

        .optional(),

    category: z.string()

        .trim()

        .max(100)

        .optional(),

    level: z.enum([

        AchievementLevel.COLLEGE,

        AchievementLevel.STATE,

        AchievementLevel.NATIONAL,

        AchievementLevel.INTERNATIONAL

    ])

        .optional(),

    position: z.string()

        .trim()

        .max(100)

        .optional(),

    certificateUrl: z.string()

        .trim()

        .url("Invalid certificate URL.")

        .optional(),

    proofUrl: z.string()

        .trim()

        .url("Invalid proof URL.")

        .optional(),

    achievementDate: z.coerce.date()

        .optional()

});
