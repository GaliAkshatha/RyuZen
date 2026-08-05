import { z } from "zod";

export const OpenAttendanceSessionSchema = z.object({

    subject: z.string().trim().min(1).max(200),

    departmentId: z.string().min(1).optional(),

    qrRotationSeconds: z.coerce.number().int().min(5).max(300).optional(),

    windowMinutes: z.coerce.number().int().min(1).max(180).optional(),

    requireLocation: z.boolean().optional(),

    latitude: z.coerce.number().min(-90).max(90).optional(),

    longitude: z.coerce.number().min(-180).max(180).optional(),

    radiusMeters: z.coerce.number().min(10).max(5000).optional()

});
