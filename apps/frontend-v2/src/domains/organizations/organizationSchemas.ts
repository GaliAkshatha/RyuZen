import { z } from "zod";

/** Mirrors the real backend CreateOrganizationSchema exactly (name 3-100 chars, code 2-10 chars, at least 1 email domain). */
export const createOrganizationSchema = z.object({
  name: z.string().trim().min(3, "At least 3 characters").max(100),
  code: z.string().trim().min(2, "At least 2 characters").max(10, "At most 10 characters"),
  emailDomainsInput: z.string().min(1, "At least one email domain is required"),
});
export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

/** Mirrors CreateOrgAdminSchema's real shape exactly - checked directly, not guessed. The password complexity regex in particular would have been easy to miss. */
export const createOrgAdminSchema = z.object({
  name: z.string().trim().min(3, "Name must contain at least 3 characters.").max(100, "Name cannot exceed 100 characters."),
  email: z.string().trim().email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(64)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain uppercase, lowercase, number and special character.",
    ),
});
export type CreateOrgAdminFormValues = z.infer<typeof createOrgAdminSchema>;
