import { z } from "zod";

/** Mirrors CreateCertificationSchema exactly */
export const createCertificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters."),
  issuer: z
    .string()
    .trim()
    .min(1, "Issuer is required.")
    .max(150, "Issuer must be at most 150 characters."),
  credentialId: z
    .string()
    .trim()
    .max(150, "Credential ID must be at most 150 characters.")
    .optional(),
  issueDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid issue date." }) }),
  expiryDate: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid expiry date." }) })
    .optional(),
  credentialUrl: z.string().trim().url("Invalid credential URL.").optional(),
  skills: z.array(z.string().trim()).optional(),
});

export type CreateCertificationFormValues = z.infer<typeof createCertificationSchema>;

/** Mirrors UpdateCertificationSchema exactly — every field optional */
export const updateCertificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters.")
    .optional(),
  issuer: z
    .string()
    .trim()
    .min(1, "Issuer is required.")
    .max(150, "Issuer must be at most 150 characters.")
    .optional(),
  credentialId: z
    .string()
    .trim()
    .max(150, "Credential ID must be at most 150 characters.")
    .optional(),
  issueDate: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid issue date." }) })
    .optional(),
  expiryDate: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid expiry date." }) })
    .optional(),
  credentialUrl: z.string().trim().url("Invalid credential URL.").optional(),
  skills: z.array(z.string().trim()).optional(),
});

export type UpdateCertificationFormValues = z.infer<typeof updateCertificationSchema>;
