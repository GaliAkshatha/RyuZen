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

 Per the Role & Permission Matrix, "Manage Notifications" is
 ORG_ADMIN and FACULTY (FACULTY requires a specific permission
 assignment; no granular permission-enforcement middleware
 currently exists in this codebase, so this is scoped by role).
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

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
