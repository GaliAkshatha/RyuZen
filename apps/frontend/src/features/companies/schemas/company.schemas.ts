import { z } from "zod";

import { CompanyStatus } from "@/types/enums";

/** Mirrors CreateCompanySchema exactly */
export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Company name is required.")
    .max(150, "Company name must be at most 150 characters."),
  logo: z.string().trim().url("Invalid logo URL.").optional(),
  website: z.string().trim().url("Invalid website URL.").optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  hrName: z.string().trim().max(150, "HR name must be at most 150 characters.").optional(),
  hrEmail: z.string().email("Invalid HR email.").optional(),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;

/** Mirrors UpdateCompanySchema exactly — every field optional */
export const updateCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Company name is required.")
    .max(150, "Company name must be at most 150 characters.")
    .optional(),
  logo: z.string().trim().url("Invalid logo URL.").optional(),
  website: z.string().trim().url("Invalid website URL.").optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  hrName: z.string().trim().max(150, "HR name must be at most 150 characters.").optional(),
  hrEmail: z.string().email("Invalid HR email.").optional(),
});

export type UpdateCompanyFormValues = z.infer<typeof updateCompanySchema>;

/** Mirrors UpdateCompanyStatusSchema exactly */
export const updateCompanyStatusSchema = z.object({
  status: z.nativeEnum(CompanyStatus),
});

export type UpdateCompanyStatusFormValues = z.infer<typeof updateCompanyStatusSchema>;
