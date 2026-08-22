import { z } from "zod";

/** Mirrors the real backend InviteAlumniSchema exactly. */
export const inviteAlumniSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  name: z.string().trim().min(2, "At least 2 characters").max(100).optional(),
  graduationYear: z.coerce.number().min(1950).max(2100).optional(),
});
export type InviteAlumniFormValues = z.infer<typeof inviteAlumniSchema>;

/** Mirrors the real backend CreateAlumniSchema exactly. */
export const createAlumniSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
  graduationYear: z.coerce.number().min(1950).max(2100).optional(),
  company: z.string().trim().max(150).optional(),
  designation: z.string().trim().max(150).optional(),
});
export type CreateAlumniFormValues = z.infer<typeof createAlumniSchema>;
