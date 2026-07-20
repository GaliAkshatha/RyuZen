import { Router } from "express";

import { MessageController } from "../controllers/MessageController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new MessageController();

/*
 Mark Message Read
*/

router.patch(

    "/:id/read",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.FACULTY,

        UserRole.STUDENT,

        UserRole.ALUMNI

    ),

    asyncHandler(

        controller.markRead.bind(controller)

    )

);

export default router;
