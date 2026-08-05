import { z } from "zod";

/** Same password strength rule used everywhere else in this domain (reset-password, change-password) - one canonical rule, not reinvented per endpoint. */
export const AcceptInvitationSchema = z.object({

    email: z
        .email()
        .transform(email => email.toLowerCase()),

    token: z
        .string()
        .min(1),

    password: z
        .string()
        .min(8)
        .max(64)
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[!@#$%^&*]/, "Must contain a special character.")

});
