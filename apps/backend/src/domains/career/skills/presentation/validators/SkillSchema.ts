import { z } from "zod";

import { SkillLevel } from "../../domain/constants/SkillLevel.js";

export const CreateSkillSchema = z.object({

    name: z.string()

        .trim()

        .min(1, "Skill name is required.")

        .max(100),

    category: z.string()

        .trim()

        .max(100)

        .optional(),

    level: z.enum([

        SkillLevel.BEGINNER,

        SkillLevel.INTERMEDIATE,

        SkillLevel.ADVANCED,

        SkillLevel.EXPERT

    ])

        .optional()

});

export const UpdateSkillSchema = z.object({

    name: z.string()

        .trim()

        .min(1)

        .max(100)

        .optional(),

    category: z.string()

        .trim()

        .max(100)

        .optional(),

    level: z.enum([

        SkillLevel.BEGINNER,

        SkillLevel.INTERMEDIATE,

        SkillLevel.ADVANCED,

        SkillLevel.EXPERT

    ])

        .optional()

});
