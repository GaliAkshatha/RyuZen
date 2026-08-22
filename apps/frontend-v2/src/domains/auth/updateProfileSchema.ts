import { z } from "zod";

/** Mirrors the real backend UpdateProfileSchema exactly. */
export const updateProfileSchema = z.object({
  name: z.string().trim().min(3, "At least 3 characters").max(100).optional(),
  image: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(20).optional(),
  bio: z.string().trim().max(300).optional(),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

/** Mirrors the real backend ChangePasswordSchema exactly - same 4-rule password strength requirement. */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .max(64)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[!@#$%^&*]/, "Must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
