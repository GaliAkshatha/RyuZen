import { z } from "zod";

/**
 * Mirrors UpdateProfileSchema exactly, grepped from the backend source
 * this milestone. Every field is optional at the schema level, but
 * still enforces its own constraint if provided. Empty strings satisfy
 * the max-length constraints trivially, so a cleared form field is
 * valid without needing a separate union branch.
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 100 characters.")
    .optional(),
  profile: z
    .object({
      image: z.string().trim().max(500, "Image URL must be at most 500 characters.").optional(),
      phone: z.string().trim().max(20, "Phone must be at most 20 characters.").optional(),
      bio: z.string().trim().max(300, "Bio must be at most 300 characters.").optional(),
    })
    .optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(64, "Password must be at most 64 characters.")
  .regex(/[A-Z]/, "Must contain an uppercase letter.")
  .regex(/[a-z]/, "Must contain a lowercase letter.")
  .regex(/[0-9]/, "Must contain a number.")
  .regex(/[!@#$%^&*]/, "Must contain a special character.");

/** Mirrors ChangePasswordSchema exactly */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: passwordRules,
});

/** Form-level schema — same client-only confirm-password convention as P1. */
export const changePasswordFormSchema = changePasswordSchema
  .extend({
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
