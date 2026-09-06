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
 List A Candidate's Mock Interview Sessions - RECRUITER only, and
 only for a real candidate who has genuinely applied to one of the
 recruiter's own company's drives (checked dynamically, same real
 rule as Career Score's and Resume's candidate routes). Uses
 "/candidate/:userId" (two segments), genuinely distinct from the
 real "/:id" (one segment) and "/:id/answer" (id + literal "answer")
 routes already on this router - no collision possible regardless of
 declaration order.
*/

router.get(

    "/candidate/:userId",

    authenticate,

    asyncHandler(

        controller.listForCandidate.bind(controller)

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

/*
 Abandon Mock Interview - a real, distinct action from answering; the
 candidate is quitting early, not submitting a final answer. No
 request body needed.
*/

router.post(

    "/:id/abandon",

    authenticate,

    asyncHandler(

        controller.abandon.bind(controller)

    )

);

export default router;
