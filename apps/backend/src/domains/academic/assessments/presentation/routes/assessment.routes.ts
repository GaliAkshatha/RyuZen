import { Router } from "express";

import { AssessmentController } from "../controllers/AssessmentController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { CreateAssessmentSchema } from "../validators/CreateAssessmentSchema.js";
import { AddAssessmentQuestionSchema } from "../validators/AddAssessmentQuestionSchema.js";
import { RecordAssessmentAnswerSchema } from "../validators/RecordAssessmentAnswerSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new AssessmentController();

const FACULTY_ROLES = [UserRole.FACULTY, UserRole.ORG_ADMIN];

router.post(

    "/",
    authenticate,
    authorizePermission(...FACULTY_ROLES),
    validate(CreateAssessmentSchema),
    asyncHandler(controller.create.bind(controller))

);

router.get(

    "/",
    authenticate,
    authorizePermission(UserRole.FACULTY, UserRole.ORG_ADMIN, UserRole.STUDENT),
    asyncHandler(controller.list.bind(controller))

);

router.post(

    "/:id/questions",
    authenticate,
    authorizePermission(...FACULTY_ROLES),
    validate(AddAssessmentQuestionSchema),
    asyncHandler(controller.addQuestion.bind(controller))

);

router.patch(

    "/:id/publish",
    authenticate,
    authorizePermission(...FACULTY_ROLES),
    asyncHandler(controller.publish.bind(controller))

);

router.get(

    "/:id/results",
    authenticate,
    authorizePermission(...FACULTY_ROLES),
    asyncHandler(controller.getResults.bind(controller))

);

/*
 The real student-safe question view - never includes correct answers,
 see GetAssessmentQuestionsForAttemptUseCase.
*/

router.get(

    "/:id/questions/attempt",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    asyncHandler(controller.getQuestionsForAttempt.bind(controller))

);

router.post(

    "/:id/attempts",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    asyncHandler(controller.startAttempt.bind(controller))

);

router.patch(

    "/attempts/:id/answer",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    validate(RecordAssessmentAnswerSchema),
    asyncHandler(controller.recordAnswer.bind(controller))

);

router.post(

    "/attempts/:id/submit",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    asyncHandler(controller.submitAttempt.bind(controller))

);

router.get(

    "/attempts/me",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    asyncHandler(controller.getMyAttempts.bind(controller))

);

export default router;
