import { z } from "zod";

/** Mirrors StartMockInterviewSchema exactly */
export const startMockInterviewSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, "A target role is required.")
    .max(150, "Role must be at most 150 characters."),
});

export type StartMockInterviewFormValues = z.infer<typeof startMockInterviewSchema>;

/** Mirrors AnswerMockInterviewSchema exactly */
export const answerMockInterviewSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, "An answer is required.")
    .max(5000, "Answer must be at most 5000 characters."),
});

export type AnswerMockInterviewFormValues = z.infer<typeof answerMockInterviewSchema>;
