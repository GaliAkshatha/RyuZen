import { z } from "zod";

export const CreateOrgAdminSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3, "Name must contain at least 3 characters.")
        .max(100, "Name cannot exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Invalid email address."),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters.")
        .max(64)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
            "Password must contain uppercase, lowercase, number and special character."
        )

});