import { z } from "zod";

export const openAttendanceSessionSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required.").max(200),
  departmentId: z.string().trim().optional(),
  qrRotationSeconds: z.coerce.number().int().min(5).max(300).optional(),
  windowMinutes: z.coerce.number().int().min(1).max(300).optional(),
  requireLocation: z.boolean().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radiusMeters: z.coerce.number().min(1).max(5000).optional(),
});

export type OpenAttendanceSessionFormValues = z.infer<typeof openAttendanceSessionSchema>;

export const requestCorrectionSchema = z.object({
  sessionId: z.string().min(1),
  reason: z.string().trim().min(1, "A reason is required.").max(1000),
});

export type RequestCorrectionFormValues = z.infer<typeof requestCorrectionSchema>;
