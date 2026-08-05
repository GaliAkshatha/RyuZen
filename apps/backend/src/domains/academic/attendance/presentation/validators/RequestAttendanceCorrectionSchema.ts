import { z } from "zod";

export const RequestAttendanceCorrectionSchema = z.object({

    sessionId: z.string().min(1),

    reason: z.string().trim().min(1, "A reason is required.").max(1000)

});
