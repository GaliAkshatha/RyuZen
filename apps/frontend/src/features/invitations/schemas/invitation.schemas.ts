import { z } from "zod";

import { UserRole } from "@/types/enums";

/** Mirrors InviteUserSchema exactly — only Faculty/Student/Alumni/Placement Admin are invitable. */
export const inviteUserSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters.").max(100),
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  role: z.enum([UserRole.PLACEMENT_ADMIN, UserRole.FACULTY, UserRole.STUDENT, UserRole.ALUMNI]),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
