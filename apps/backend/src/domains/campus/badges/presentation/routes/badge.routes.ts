import { Router } from "express";

import { BadgeController } from "../controllers/BadgeController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateBadgeSchema } from "../validators/CreateBadgeSchema.js";
import { UpdateBadgeSchema } from "../validators/UpdateBadgeSchema.js";
import { AwardBadgeSchema } from "../validators/AwardBadgeSchema.js";

const router = Router();

const controller = new BadgeController();

/*
 Create Badge (global catalog)
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    validate(

        CreateBadgeSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Badges
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 My Badges - STUDENT only, self-scoped. Declared before "/:id" and
 "/students/:studentId" so "me" is never captured as an id/studentId
 route parameter.
*/

router.get(

    "/me",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.getMine.bind(controller)

    )

);

/*
 List Badges Awarded To A Student

 Declared before "/:id" so "students" is not
 captured as a badge id route parameter.
*/

router.get(

    "/students/:studentId",

    authenticate,

    asyncHandler(

        controller.listForStudent.bind(controller)

    )

);

/*
 Get Badge
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Badge
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    validate(

        UpdateBadgeSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Badge
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

/*
 Award Badge To Student
*/

router.post(

    "/:id/award",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    validate(

        AwardBadgeSchema

    ),

    asyncHandler(

        controller.award.bind(controller)

    )

);

export default router;
