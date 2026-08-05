import { z } from "zod";

import { InterviewRoundType } from "@/types/enums";

export const scheduleInterviewRoundSchema = z.object({
  roundType: z.nativeEnum(InterviewRoundType),
  scheduledAt: z.string().optional(),
  interviewerId: z.string().trim().optional(),
});

export type ScheduleInterviewRoundFormValues = z.infer<typeof scheduleInterviewRoundSchema>;

export const evaluateInterviewRoundSchema = z.object({
  passed: z.enum(["true", "false"]),
  rating: z.coerce.number().min(1).max(10).optional(),
  strengths: z.string().trim().max(2000).optional(),
  weaknesses: z.string().trim().max(2000).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type EvaluateInterviewRoundFormValues = z.infer<typeof evaluateInterviewRoundSchema>;
