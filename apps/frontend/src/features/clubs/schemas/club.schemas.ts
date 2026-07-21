import { z } from "zod";

import { ClubMemberRole } from "@/types/enums";

/** Mirrors CreateClubSchema exactly */
export const createClubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be at most 150 characters."),
  code: z
    .string()
    .trim()
    .min(2, "Code must be at least 2 characters.")
    .max(20, "Code must be at most 20 characters."),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters.")
    .optional(),
  logo: z.string().trim().max(500, "Logo URL must be at most 500 characters.").optional(),
  facultyAdvisorId: z.string().trim().min(1).optional(),
});

export type CreateClubFormValues = z.infer<typeof createClubSchema>;

/** Mirrors UpdateClubSchema exactly — no "code" field */
export const updateClubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be at most 150 characters.")
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters.")
    .optional(),
  logo: z.string().trim().max(500, "Logo URL must be at most 500 characters.").optional(),
});

export type UpdateClubFormValues = z.infer<typeof updateClubSchema>;

/** Mirrors AssignAdvisorSchema exactly */
export const assignAdvisorSchema = z.object({
  facultyId: z.string().trim().min(1, "Faculty id is required."),
});

export type AssignAdvisorFormValues = z.infer<typeof assignAdvisorSchema>;

/** Mirrors AddClubMemberSchema exactly */
export const addClubMemberSchema = z.object({
  studentId: z.string().trim().min(1, "Student id is required."),
  role: z.nativeEnum(ClubMemberRole).optional(),
});

export type AddClubMemberFormValues = z.infer<typeof addClubMemberSchema>;
