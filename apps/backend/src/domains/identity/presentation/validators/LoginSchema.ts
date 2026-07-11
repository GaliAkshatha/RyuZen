import { z } from "zod";

export const LoginSchema = z.object({

    email: z
        .email()
        .transform(email => email.toLowerCase()),

    password: z
        .string()
        .min(1)

});