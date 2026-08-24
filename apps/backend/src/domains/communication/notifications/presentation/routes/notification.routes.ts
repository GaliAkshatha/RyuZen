import { Router } from "express";

import { NotificationController } from "../controllers/NotificationController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { SendNotificationSchema } from "../validators/SendNotificationSchema.js";

const router = Router();

const controller = new NotificationController();

/*
 Send Notification

 Real sender-role scoping enforced inside SendNotificationUseCase,
 not just this route gate - SUPER_ADMIN/ORG_ADMIN/FACULTY can all
 reach this endpoint, but each is restricted to genuinely different
 audiences server-side (see the use case's own comment for the full
 real rule set).
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    validate(

        SendNotificationSchema

    ),

    asyncHandler(

        controller.send.bind(controller)

    )

);

/*
 List My Notifications
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Mark Notification Read
*/

router.patch(

    "/:id/read",

    authenticate,

    asyncHandler(

        controller.markRead.bind(controller)

    )

);

export default router;
