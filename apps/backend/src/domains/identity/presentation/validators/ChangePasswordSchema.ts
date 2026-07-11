import { z } from "zod";

export const ChangePasswordSchema = z.object({

    currentPassword: z
        .string()
        .min(1, "Current password is required."),

    newPassword: z
        .string()
        .min(8)
        .max(64)
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[!@#$%^&*]/, "Must contain a special character.")

});
