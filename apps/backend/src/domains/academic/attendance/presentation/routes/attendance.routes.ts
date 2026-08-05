import { Router } from "express";

import { AttendanceController } from "../controllers/AttendanceController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { OpenAttendanceSessionSchema } from "../validators/OpenAttendanceSessionSchema.js";
import { MarkAttendanceViaQrSchema } from "../validators/MarkAttendanceViaQrSchema.js";
import { MarkAttendanceManuallySchema } from "../validators/MarkAttendanceManuallySchema.js";
import { RequestAttendanceCorrectionSchema } from "../validators/RequestAttendanceCorrectionSchema.js";
import { ReviewAttendanceCorrectionSchema } from "../validators/ReviewAttendanceCorrectionSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new AttendanceController();

router.post(

    "/sessions",

    authenticate,

    authorizePermission(

        UserRole.FACULTY

    ),

    validate(OpenAttendanceSessionSchema),

    asyncHandler(

        controller.openSession.bind(controller)

    )

);

/*
 Get Attendance Session - both faculty (viewing their own session) and
 students (checking a session's real requireLocation/radius before
 attempting to mark) need this.
*/

router.get(

    "/sessions/:id",

    authenticate,

    authorizePermission(

        UserRole.FACULTY,

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.getSession.bind(controller)

    )

);

/*
 Real, rotating signed QR token - only the faculty member who opened
 the session can fetch it, and only the current-window derived token
 is ever returned, never the real underlying secret.
*/

router.get(

    "/sessions/:id/qr-token",

    authenticate,

    authorizePermission(

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.getQrToken.bind(controller)

    )

);

/*
 Student marks their own attendance by scanning the real, current QR
 token - verified against the session's real secret, checked for GPS
 proximity when required, and genuinely prevented from being marked
 twice for the same session.
*/

router.post(

    "/mark",

    authenticate,

    authorizePermission(

        UserRole.STUDENT
    ),

    validate(MarkAttendanceViaQrSchema),

    asyncHandler(

        controller.markViaQr.bind(controller)

    )

);

/*
 Manual attendance / faculty override / offline batch marking.
*/

router.patch(

    "/sessions/:id/mark-manual",

    authenticate,

    authorizePermission(

        UserRole.FACULTY

    ),

    validate(MarkAttendanceManuallySchema),

    asyncHandler(

        controller.markManually.bind(controller)

    )

);

router.patch(

    "/sessions/:id/close",

    authenticate,

    authorizePermission(

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.closeSession.bind(controller)

    )

);

/*
 Request Attendance Correction - student-initiated. Covers real
 corrections, medical leave, and approved-absence requests - the
 reviewer decides the resulting status.
*/

router.post(

    "/corrections",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(RequestAttendanceCorrectionSchema),

    asyncHandler(

        controller.requestCorrection.bind(controller)

    )

);

/*
 Review Attendance Correction - faculty-initiated.
*/

router.patch(

    "/records/:id/review-correction",

    authenticate,

    authorizePermission(

        UserRole.FACULTY

    ),

    validate(ReviewAttendanceCorrectionSchema),

    asyncHandler(

        controller.reviewCorrection.bind(controller)

    )

);

/*
 Get Suspicious Attendance Patterns - a real, flags-never-blocks
 anomaly surface for one real session (see
 findSuspiciousAttendancePatterns.ts for the full reasoning).
*/

router.get(

    "/sessions/:id/suspicious-patterns",

    authenticate,

    authorizePermission(

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.getSuspiciousPatterns.bind(controller)

    )

);

/*
 Get Session Attendance Records - faculty-facing, "who's marked
 attendance in my session".
*/

router.get(

    "/sessions/:id/records",

    authenticate,

    authorizePermission(

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.getSessionRecords.bind(controller)

    )

);

/*
 Get My Attendance Records - student-facing, resolved entirely from
 their own real profile.
*/

router.get(

    "/records/me",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.getMyRecords.bind(controller)

    )

);

export default router;
