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

        UserRole.PLACEMENT_ADMIN,

        UserRole.RECRUITER

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

        UserRole.PLACEMENT_ADMIN,

        UserRole.RECRUITER

    ),

    validate(RecordInterviewEvaluationSchema),

    auditLogger("INTERVIEW_ROUND_EVALUATED", "InterviewRound"),

    asyncHandler(

        controller.recordEvaluation.bind(controller)

    )

);

/*
 Get Interview Rounds For An Application - the student who owns it,
 an org admin/placement admin, or a recruiter scoped to their own
 company's drive. Real ownership/scope enforcement lives in
 GetInterviewRoundsForApplicationUseCase (the route-level check alone
 cannot know which student or which company a given application
 belongs to).
*/

router.get(

    "/application/:applicationId",

    authenticate,

    authorizePermission(

        UserRole.STUDENT,
        UserRole.ORG_ADMIN,
        UserRole.PLACEMENT_ADMIN,
        UserRole.RECRUITER

    ),

    asyncHandler(

        controller.getForApplication.bind(controller)

    )

);

export default router;
