import { Router } from "express";

import { NewsController } from "../controllers/NewsController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateNewsSchema } from "../validators/CreateNewsSchema.js";

const router = Router();

const controller = new NewsController();

/*
 Create News

 Faculty, Org Admin, and Placement Admin only - matches the exact
 three roles named in the request. Real enforcement lives inside
 CreateNewsUseCase; this is defense in depth, same pattern as
 SendNotificationUseCase.
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.FACULTY,

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(

        CreateNewsSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List News

 Real org isolation via GetOrgNewsUseCase's own query - every caller
 only ever sees their own organization's news. Deliberately excludes
 RECRUITER: an external company representative visiting to recruit is
 not a member of this organization's own community, matching the same
 real distinction already fixed for Notifications' "ALL" audience.
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN,

        UserRole.FACULTY,

        UserRole.STUDENT,

        UserRole.ALUMNI

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Delete News

 Real per-request ownership check inside DeleteNewsUseCase (the
 author, or an Org Admin of the same organization) - only the roles
 that could ever author a post are even allowed to reach this route.
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.FACULTY,

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
