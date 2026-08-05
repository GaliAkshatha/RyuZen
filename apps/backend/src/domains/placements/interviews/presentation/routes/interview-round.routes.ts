import { Router } from "express";

import { InterviewRoundController } from "../controllers/InterviewRoundController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { auditLogger } from "../../../../../shared/core/middleware/auditLogger.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { ScheduleInterviewRoundSchema } from "../validators/ScheduleInterviewRoundSchema.js";
import { RecordInterviewEvaluationSchema } from "../validators/RecordInterviewEvaluationSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new InterviewRoundController();

/*
 Schedule Interview Round
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(ScheduleInterviewRoundSchema),

    auditLogger("INTERVIEW_ROUND_SCHEDULED", "InterviewRound"),

    asyncHandler(

        controller.schedule.bind(controller)

    )

);

/*
 Record Interview Evaluation - structured, per round.
*/

router.patch(

    "/:id/evaluate",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(RecordInterviewEvaluationSchema),

    auditLogger("INTERVIEW_ROUND_EVALUATED", "InterviewRound"),

    asyncHandler(

        controller.recordEvaluation.bind(controller)

    )

);

/*
 Get Interview Rounds For An Application - the student who owns it, or
 an org admin/placement admin. See GetInterviewRoundsForApplicationUseCase
 for the real ownership check.
*/

router.get(

    "/application/:applicationId",

    authenticate,

    asyncHandler(

        controller.getForApplication.bind(controller)

    )

);

export default router;
