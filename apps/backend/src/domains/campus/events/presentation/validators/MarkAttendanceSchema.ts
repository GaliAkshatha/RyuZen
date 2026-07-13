import { z } from "zod";

export const MarkAttendanceSchema = z.object({

    studentId: z.string()

        .trim()

        .min(1, "Student id is required."),

    attended: z.boolean()

});
