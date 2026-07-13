import { Router } from "express";

import { MentorshipController } from "../controllers/MentorshipController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { UpdateMentorshipSchema } from "../validators/UpdateMentorshipSchema.js";

const router = Router();

const controller = new MentorshipController();

/*
 List Mentorships
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Mentorship
*/

router.get(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Mentorship Remarks
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    validate(

        UpdateMentorshipSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Complete Mentorship
*/

router.patch(

    "/:id/complete",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.complete.bind(controller)

    )

);

/*
 Cancel Mentorship
*/

router.patch(

    "/:id/cancel",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.cancel.bind(controller)

    )

);

export default router;
