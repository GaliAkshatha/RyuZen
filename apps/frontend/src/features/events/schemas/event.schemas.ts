import { z } from "zod";

/** Mirrors CreateEventSchema exactly */
export const createEventSchema = z.object({
  clubId: z.string().trim().min(1).optional(),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(200, "Title must be at most 200 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(3000, "Description must be at most 3000 characters."),
  venue: z.string().trim().max(300, "Venue must be at most 300 characters.").optional(),
  startDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid start date." }) }),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid end date." }) }),
  registrationDeadline: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid deadline." }) })
    .optional(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1.").optional(),
  points: z.coerce.number().min(0, "Points must be at least 0.").optional(),
  certificateEnabled: z.boolean().optional(),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

/** Mirrors UpdateEventSchema exactly — every field optional */
export const updateEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(200, "Title must be at most 200 characters.")
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(3000, "Description must be at most 3000 characters.")
    .optional(),
  venue: z.string().trim().max(300, "Venue must be at most 300 characters.").optional(),
  startDate: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid start date." }) })
    .optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid end date." }) }).optional(),
  registrationDeadline: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid deadline." }) })
    .optional(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1.").optional(),
  points: z.coerce.number().min(0, "Points must be at least 0.").optional(),
  certificateEnabled: z.boolean().optional(),
});

export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;

/** Mirrors MarkAttendanceSchema exactly */
export const markAttendanceSchema = z.object({
  studentId: z.string().trim().min(1, "Student id is required."),
  attended: z.boolean(),
});

export type MarkAttendanceFormValues = z.infer<typeof markAttendanceSchema>;

/** Mirrors SubmitEventFeedbackSchema exactly */
export const submitEventFeedbackSchema = z.object({
  feedback: z
    .string()
    .trim()
    .min(1, "Feedback is required.")
    .max(1000, "Feedback cannot exceed 1000 characters."),
});

export type SubmitEventFeedbackFormValues = z.infer<typeof submitEventFeedbackSchema>;
