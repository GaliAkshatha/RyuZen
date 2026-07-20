import { z } from "zod";

/** Mirrors InviteAlumniSchema exactly (backend uses Zod v4 z.email(); frontend uses v3 z.string().email() — same rule) */
export const inviteAlumniSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters.")
    .optional(),
  graduationYear: z.coerce
    .number()
    .min(1950, "Graduation year must be 1950 or later.")
    .max(2100, "Graduation year must be 2100 or earlier.")
    .optional(),
});

export type InviteAlumniFormValues = z.infer<typeof inviteAlumniSchema>;

/** Mirrors UpdateAlumniSchema exactly — this is "alumniSchema" per the roadmap's naming */
export const alumniSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters.")
    .optional(),
  graduationYear: z.coerce
    .number()
    .min(1950, "Graduation year must be 1950 or later.")
    .max(2100, "Graduation year must be 2100 or earlier.")
    .optional(),
  company: z.string().trim().max(150, "Company must be at most 150 characters.").optional(),
  designation: z.string().trim().max(150, "Designation must be at most 150 characters.").optional(),
});

export type AlumniFormValues = z.infer<typeof alumniSchema>;
