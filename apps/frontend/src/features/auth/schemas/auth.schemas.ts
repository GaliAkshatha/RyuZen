import { z } from "zod";

/**
 * Every rule below is copied exactly from the backend's real Zod
 * validators (domains/identity/presentation/validators/*.ts), grepped
 * directly from the backend source during this milestone. The backend
 * uses Zod v4 (`z.email()`); this project's frontend uses Zod v3 (see
 * package.json) for broader react-hook-form resolver ecosystem
 * stability, consistent with F1's stability-first dependency choices —
 * the validation RULES are identical, only the v3-vs-v4 method syntax
 * differs (`z.string().email()` vs `z.email()`).
 */

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(64, "Password must be at most 64 characters.")
  .regex(/[A-Z]/, "Must contain an uppercase letter.")
  .regex(/[a-z]/, "Must contain a lowercase letter.")
  .regex(/[0-9]/, "Must contain a number.")
  .regex(/[!@#$%^&*]/, "Must contain a special character.");

/** Mirrors LoginSchema exactly */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** Mirrors RegisterUserSchema exactly */
export const registerSchema = z.object({
  organizationCode: z
    .string()
    .trim()
    .min(2, "Organization code must be at least 2 characters.")
    .max(20, "Organization code must be at most 20 characters."),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 100 characters."),
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  password: passwordRules,
});

/**
 * Form-level schema only — adds a client-only confirmPassword check.
 * `confirmPassword` is never sent to the backend (stripped before the
 * API call); this does not change or invent any backend validation
 * rule, it's a standard client-side double-entry UX convention.
 */
export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

/** Mirrors ForgotPasswordSchema exactly */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/** Mirrors ResetPasswordSchema exactly */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  token: z.string().min(1, "Reset token is required."),
  newPassword: passwordRules,
});

/** Form-level schema — same confirmPassword convention as registerFormSchema. */
export const resetPasswordFormSchema = resetPasswordSchema
  .extend({
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
