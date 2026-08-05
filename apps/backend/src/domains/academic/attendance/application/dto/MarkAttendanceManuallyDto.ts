import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";
import { AttendanceMethod } from "../../domain/constants/AttendanceMethod.js";

export interface MarkAttendanceManuallyDto {

    studentId: string;

    status: AttendanceRecordStatus;

    /** MANUAL for a real-time faculty override, OFFLINE for after-the-fact batch marking when connectivity genuinely wasn't available during the session. */
    method: AttendanceMethod;

}
