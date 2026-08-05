import { z } from "zod";

export const MarkAttendanceViaQrSchema = z.object({

    sessionId: z.string().min(1),

    token: z.string().min(1),

    latitude: z.coerce.number().min(-90).max(90).optional(),

    longitude: z.coerce.number().min(-180).max(180).optional()

});
