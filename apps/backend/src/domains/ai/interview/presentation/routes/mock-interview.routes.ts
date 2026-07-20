import { Router } from "express";

import { MockInterviewController } from "../controllers/MockInterviewController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { StartMockInterviewSchema } from "../validators/StartMockInterviewSchema.js";
import { AnswerMockInterviewSchema } from "../validators/AnswerMockInterviewSchema.js";

const router = Router();

const controller = new MockInterviewController();

/*
 Start Mock Interview
*/

router.post(

    "/",

    authenticate,

    validate(

        StartMockInterviewSchema

    ),

    asyncHandler(

        controller.start.bind(controller)

    )

);

/*
 List My Mock Interview Sessions
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Mock Interview Session
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Answer Mock Interview Question
*/

router.post(

    "/:id/answer",

    authenticate,

    validate(

        AnswerMockInterviewSchema

    ),

    asyncHandler(

        controller.answer.bind(controller)

    )

);

export default router;
