import { z } from "zod";

export const UpdateOrganizationSchema = z.object({

    name: z.string()

        .trim()

        .min(3)

        .max(100)

        .optional(),

    logo: z.string()

        .trim()

        .max(500)

        .optional(),

    website: z.string()

        .trim()

        .max(300)

        .optional(),

    emailDomains:

        z.array(

            z.string()

        )

        .min(1)

        .optional(),

    settings: z.object({

        allowStudentRegistration: z.boolean().optional(),

        requireEmailVerification: z.boolean().optional(),

        requireAdminApproval: z.boolean().optional(),

        enableAI: z.boolean().optional(),

        enableActivities: z.boolean().optional(),

        enableLeaderboard: z.boolean().optional(),

        enableChat: z.boolean().optional(),

        enableNotifications: z.boolean().optional(),

        enableCareer: z.boolean().optional(),

        enableGames: z.boolean().optional(),

        enableAlumni: z.boolean().optional()

    }).optional()

});
