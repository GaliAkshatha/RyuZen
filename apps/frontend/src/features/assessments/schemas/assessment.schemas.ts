import { z } from "zod";

export const createAssessmentSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  description: z.string().trim().max(2000).optional(),
  type: z.enum(["APTITUDE", "BRANCH_SPECIFIC", "WEEKLY", "COMPANY_SPECIFIC"]),
  departmentId: z.string().trim().optional(),
  durationMinutes: z.coerce.number().int().min(1).max(600),
  passingScore: z.coerce.number().min(0).optional(),
});

export type CreateAssessmentFormValues = z.infer<typeof createAssessmentSchema>;

export const addQuestionSchema = z.object({
  questionText: z.string().trim().min(1, "Question text is required."),
  type: z.enum(["MCQ_SINGLE", "MCQ_MULTIPLE", "TRUE_FALSE"]),
  optionsText: z.string().trim().min(1, "Enter at least 2 options, one per line."),
  correctOptionIndexesText: z.string().trim().min(1, "Enter at least one correct option number."),
  marks: z.coerce.number().min(1).max(100),
});

export type AddQuestionFormValues = z.infer<typeof addQuestionSchema>;
