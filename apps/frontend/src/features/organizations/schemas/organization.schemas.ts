import { z } from "zod";

import { OrganizationStatus } from "@/types/enums";

/** Mirrors CreateOrganizationSchema exactly */
export const createOrganizationSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters.").max(100),
  code: z.string().trim().min(2, "Code must be at least 2 characters.").max(10),
  emailDomains: z.array(z.string().trim()).min(1, "At least one email domain is required."),
});

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

const organizationSettingsSchema = z.object({
  allowStudentRegistration: z.boolean().optional(),
  requireEmailVerification: z.boolean().optional(),
  requireAdminApproval: z.boolean().optional(),
  enableAI: z.boolean().optional(),
  enableActivities: z.boolean().optional(),
  enableLeaderboard: z.boolean().optional(),
  enableChat: z.boolean().optional(),
  enableNotifications: z.boolean().optional(),
  enableCareer: z.boolean().optional(),
  enableGames: z.boolean().optional(),
  enableAlumni: z.boolean().optional(),
});

/** Mirrors UpdateOrganizationSchema exactly — every field optional */
export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters.").max(100).optional(),
  logo: z.string().trim().max(500).optional(),
  website: z.string().trim().max(300).optional(),
  emailDomains: z.array(z.string().trim()).min(1).optional(),
  settings: organizationSettingsSchema.optional(),
});

export type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;

/** Mirrors UpdateOrganizationStatusSchema exactly */
export const updateOrganizationStatusSchema = z.object({
  status: z.nativeEnum(OrganizationStatus),
});

export type UpdateOrganizationStatusFormValues = z.infer<typeof updateOrganizationStatusSchema>;

/**
 * Mirrors CreateOrgAdminSchema exactly — including its own specific
 * password regex, which uses a DIFFERENT special-character set
 * (`[@$!%*?&]`) than the auth module's registration password rule
 * (`[!@#$%^&*]`).
 */
export const createOrgAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must contain at least 3 characters.")
    .max(100, "Name cannot exceed 100 characters."),
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
