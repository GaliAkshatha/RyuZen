import { AttendanceSessionRepository } from "../../infrastructure/repositories/AttendanceSessionRepository.js";
import { AttendanceRecordRepository } from "../../infrastructure/repositories/AttendanceRecordRepository.js";

import {
    StudentRepository,
} from "../../../students/infrastructure/repositories/StudentRepository.js";

import { OpenAttendanceSessionUseCase } from "../use-cases/OpenAttendanceSessionUseCase.js";
import { GetAttendanceSessionUseCase } from "../use-cases/GetAttendanceSessionUseCase.js";
import { GetAttendanceQrTokenUseCase } from "../use-cases/GetAttendanceQrTokenUseCase.js";
import { MarkAttendanceViaQrUseCase } from "../use-cases/MarkAttendanceViaQrUseCase.js";
import { MarkAttendanceManuallyUseCase } from "../use-cases/MarkAttendanceManuallyUseCase.js";
import { CloseAttendanceSessionUseCase } from "../use-cases/CloseAttendanceSessionUseCase.js";
import { RequestAttendanceCorrectionUseCase } from "../use-cases/RequestAttendanceCorrectionUseCase.js";
import { ReviewAttendanceCorrectionUseCase } from "../use-cases/ReviewAttendanceCorrectionUseCase.js";
import { GetSuspiciousAttendancePatternsUseCase } from "../use-cases/GetSuspiciousAttendancePatternsUseCase.js";
import { GetSessionAttendanceRecordsUseCase } from "../use-cases/GetSessionAttendanceRecordsUseCase.js";
import { GetMyAttendanceRecordsUseCase } from "../use-cases/GetMyAttendanceRecordsUseCase.js";

import { auditContainer } from "../../../../platform/audit/application/container/AuditContainer.js";

import {
    notificationContainer,
} from "../../../../communication/notifications/application/container/NotificationContainer.js";

const attendanceSessionRepository = new AttendanceSessionRepository();

const attendanceRecordRepository = new AttendanceRecordRepository();

const studentRepository = new StudentRepository();

export const attendanceContainer = {

    openSession:

        new OpenAttendanceSessionUseCase(
            attendanceSessionRepository
        ),

    getSession:

        new GetAttendanceSessionUseCase(
            attendanceSessionRepository
        ),

    getQrToken:

        new GetAttendanceQrTokenUseCase(
            attendanceSessionRepository
        ),

    markViaQr:

        new MarkAttendanceViaQrUseCase(

            attendanceSessionRepository,

            attendanceRecordRepository,

            studentRepository,

            auditContainer.createAuditLog

        ),

    markManually:

        new MarkAttendanceManuallyUseCase(

            attendanceSessionRepository,

            attendanceRecordRepository,

            studentRepository,

            auditContainer.createAuditLog

        ),

    closeSession:

        new CloseAttendanceSessionUseCase(
            attendanceSessionRepository
        ),

    requestCorrection:

        new RequestAttendanceCorrectionUseCase(

            attendanceSessionRepository,

            attendanceRecordRepository,

            studentRepository

        ),

    reviewCorrection:

        new ReviewAttendanceCorrectionUseCase(

            attendanceRecordRepository,

            studentRepository,

            notificationContainer.recordSystemNotification

        ),

    getSuspiciousPatterns:

        new GetSuspiciousAttendancePatternsUseCase(

            attendanceSessionRepository,

            attendanceRecordRepository

        ),

    getSessionRecords:

        new GetSessionAttendanceRecordsUseCase(

            attendanceSessionRepository,

            attendanceRecordRepository

        ),

    getMyRecords:

        new GetMyAttendanceRecordsUseCase(

            attendanceRecordRepository,

            studentRepository

        )

};
