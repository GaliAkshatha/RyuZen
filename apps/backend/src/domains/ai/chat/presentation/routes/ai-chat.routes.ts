import { Router } from "express";

import { AIChatController } from "../controllers/AIChatController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { SendAIChatMessageSchema } from "../validators/SendAIChatMessageSchema.js";

const router = Router();

const controller = new AIChatController();

/*
 Send AI Chat Message

 Creates a new session when no chatId is provided, otherwise
 continues an existing session owned by the caller.
*/

router.post(

    "/",

    authenticate,

    validate(

        SendAIChatMessageSchema

    ),

    asyncHandler(

        controller.sendMessage.bind(controller)

    )

);

/*
 List My AI Chat Sessions
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get AI Chat Session
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

export default router;
