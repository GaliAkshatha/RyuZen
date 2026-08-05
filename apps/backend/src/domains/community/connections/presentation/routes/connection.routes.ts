import { Router } from "express";

import { ConnectionController } from "../controllers/ConnectionController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { SendConnectionRequestSchema } from "../validators/SendConnectionRequestSchema.js";
import { RespondToConnectionRequestSchema } from "../validators/RespondToConnectionRequestSchema.js";

const router = Router();

const controller = new ConnectionController();

/*
 Real people directory - any authenticated user, scoped to their own
 real organization only (see GetConnectableUsersUseCase).
*/

router.get(

    "/people",
    authenticate,
    asyncHandler(controller.getPeople.bind(controller))

);

router.post(

    "/requests",
    authenticate,
    validate(SendConnectionRequestSchema),
    asyncHandler(controller.send.bind(controller))

);

router.patch(

    "/requests/:id",
    authenticate,
    validate(RespondToConnectionRequestSchema),
    asyncHandler(controller.respond.bind(controller))

);

router.get(

    "/requests/pending",
    authenticate,
    asyncHandler(controller.getPending.bind(controller))

);

router.get(

    "/me",
    authenticate,
    asyncHandler(controller.getMyConnections.bind(controller))

);

export default router;
