import { AttendanceMethod } from "../../domain/constants/AttendanceMethod.js";
import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";
import { AttendanceCorrectionStatus } from "../../domain/constants/AttendanceCorrectionStatus.js";

export interface AttendanceRecordResponseDto {

    id: string;

    sessionId: string;

    studentId: string;

    method: AttendanceMethod;

    status: AttendanceRecordStatus;

    markedAt: Date;

    markedBy?: string;

    correctionStatus?: AttendanceCorrectionStatus;

    correctionReason?: string;

    correctionReviewedBy?: string;

}
