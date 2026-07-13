import { z } from "zod";

export const InviteAlumniSchema = z.object({

    email: z.email()

        .transform(email => email.toLowerCase()),

    name: z.string()

        .trim()

        .min(2)

        .max(100)

        .optional(),

    graduationYear: z.number()

        .min(1950)

        .max(2100)

        .optional()

});
