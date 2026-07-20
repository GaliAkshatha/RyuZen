import { Router } from "express";

import { DashboardController } from "../controllers/DashboardController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new DashboardController();

/*
 Get Organization Dashboard

 Per the Role & Permission Matrix, "View Analytics" is full
 access for SUPER_ADMIN and ORG_ADMIN. FACULTY/STUDENT have
 "Limited" access per the matrix; a reduced, role-scoped view for
 them is not built in this milestone.
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.get.bind(controller)

    )

);

export default router;
