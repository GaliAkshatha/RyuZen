import { z } from "zod";

/** Mirrors the real backend LoginSchema exactly - email format + non-empty password, no client-invented complexity rules. */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
