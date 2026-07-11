import { z } from "zod";

export const RegisterUserSchema = z.object({

    organizationCode: z
        .string()
        .trim()
        .min(2)
        .max(20),

    name: z
        .string()
        .trim()
        .min(3)
        .max(100),

    email: z
        .email()
        .transform(email => email.toLowerCase()),

    password: z
        .string()
        .min(8)
        .max(64)
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[!@#$%^&*]/, "Must contain a special character.")

});