import { z } from "zod";

import { UserRole } from "../../domain/constants/UserRole.js";

export const InviteUserSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3)
        .max(100),

    email: z
        .email()
        .transform(email => email.toLowerCase()),

    role: z.enum([
        UserRole.PLACEMENT_ADMIN,
        UserRole.FACULTY,
        UserRole.STUDENT,
        UserRole.ALUMNI
    ])

});
