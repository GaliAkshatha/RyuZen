import { z } from "zod";

import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";

export const ReviewAttendanceCorrectionSchema = z.object({

    approved: z.boolean(),

    newStatus: z.enum([

        AttendanceRecordStatus.PRESENT,
        AttendanceRecordStatus.LATE,
        AttendanceRecordStatus.EXCUSED

    ]).optional()

});
