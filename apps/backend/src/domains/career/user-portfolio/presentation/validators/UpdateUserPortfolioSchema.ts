import { z } from "zod";

import { PortfolioVisibility } from "../../domain/constants/PortfolioVisibility.js";

export const UpdateUserPortfolioSchema = z.object({

    headline: z.string()

        .trim()

        .max(200)

        .optional(),

    summary: z.string()

        .trim()

        .max(2000)

        .optional(),

    github: z.string()

        .trim()

        .url("Invalid GitHub URL.")

        .optional(),

    linkedin: z.string()

        .trim()

        .url("Invalid LinkedIn URL.")

        .optional(),

    leetcode: z.string()

        .trim()

        .url("Invalid LeetCode URL.")

        .optional(),

    codeforces: z.string()

        .trim()

        .url("Invalid Codeforces URL.")

        .optional(),

    portfolio: z.string()

        .trim()

        .url("Invalid portfolio URL.")

        .optional(),

    behance: z.string()

        .trim()

        .url("Invalid Behance URL.")

        .optional(),

    dribbble: z.string()

        .trim()

        .url("Invalid Dribbble URL.")

        .optional(),

    website: z.string()

        .trim()

        .url("Invalid website URL.")

        .optional(),

    visibility: z.enum([

        PortfolioVisibility.PUBLIC,

        PortfolioVisibility.PRIVATE

    ])

        .optional(),

    theme: z.string()

        .trim()

        .max(50)

        .optional()

});
