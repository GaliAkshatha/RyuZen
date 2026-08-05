import { Router } from "express";

import { JobApplicationController } from "../controllers/JobApplicationController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ApplyToPlacementSchema } from "../validators/ApplyToPlacementSchema.js";
import { UpdateJobApplicationStatusSchema } from "../validators/UpdateJobApplicationStatusSchema.js";

const router = Router();

const controller = new JobApplicationController();

/*
 Apply To Placement Drive

 Per the Role & Permission Matrix, applying is STUDENT only.
*/

router.post(

    "/:placementId",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        ApplyToPlacementSchema

    ),

    asyncHandler(

        controller.apply.bind(controller)

    )

);

/*
 My Applications

 Declared before "/:id" to avoid "me" being
 captured as an application id route parameter.
*/

router.get(

    "/me",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.me.bind(controller)

    )

);

/*
 List Applications For A Placement Drive
*/

router.get(

    "/placements/:placementId",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.listForPlacement.bind(controller)

    )

);

/*
 Get Application
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Application Status
*/

router.patch(

    "/:id/status",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(

        UpdateJobApplicationStatusSchema

    ),

    asyncHandler(

        controller.updateStatus.bind(controller)

    )

);

export default router;
