import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";

export interface ReviewAttendanceCorrectionDto {

    approved: boolean;

    /** Required when approved - what the record's real status becomes. PRESENT/LATE if they genuinely attended, EXCUSED for a genuinely approved absence (medical leave, official duty). */
    newStatus?: AttendanceRecordStatus;

}
