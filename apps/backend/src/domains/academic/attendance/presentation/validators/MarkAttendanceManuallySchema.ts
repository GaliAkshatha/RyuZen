import { z } from "zod";

import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";
import { AttendanceMethod } from "../../domain/constants/AttendanceMethod.js";

export const MarkAttendanceManuallySchema = z.object({

    studentId: z.string().min(1),

    status: z.enum([

        AttendanceRecordStatus.PRESENT,
        AttendanceRecordStatus.LATE,
        AttendanceRecordStatus.ABSENT

    ]),

    method: z.enum([

        AttendanceMethod.MANUAL,
        AttendanceMethod.OFFLINE

    ])

});
