import { z } from "zod";

/** Mirrors the real backend CreateCompanySchema exactly - real URL/email format validation confirmed. */
export const createCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(150),
  logo: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  website: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional(),
  hrName: z.string().trim().max(150).optional(),
  hrEmail: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
});
export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
