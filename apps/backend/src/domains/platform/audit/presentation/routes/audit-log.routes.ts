import { Router } from "express";

import { AuditLogController } from "../controllers/AuditLogController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new AuditLogController();

/*
 List Audit Logs
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Audit Log
*/

router.get(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.getById.bind(controller)

    )

);

export default router;