import { z } from "zod";

/** Mirrors the real backend InviteUserSchema exactly. */
export const inviteUserSchema = z.object({
  name: z.string().trim().min(3, "At least 3 characters").max(100),
  email: z.string().trim().email("Enter a valid email"),
  role: z.enum(["PLACEMENT_ADMIN", "FACULTY", "STUDENT", "ALUMNI"]),
});
export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
