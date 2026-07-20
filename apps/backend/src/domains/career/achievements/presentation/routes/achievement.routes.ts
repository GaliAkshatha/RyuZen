import { Router } from "express";

import { AchievementController } from "../controllers/AchievementController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    CreateAchievementSchema,
    UpdateAchievementSchema
} from "../validators/AchievementSchema.js";

const router = Router();

const controller = new AchievementController();

/*
 Submit Achievement
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        CreateAchievementSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Achievements
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
 My Achievements

 Declared before "/:id" to avoid "me" being
 captured as an achievement id route parameter.
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
 List Achievements For A Student
*/

router.get(

    "/students/:studentId",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.listForStudent.bind(controller)

    )

);

/*
 Get Achievement
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Achievement
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        UpdateAchievementSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Achievement
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

/*
 Verify Achievement
*/

router.patch(

    "/:id/verify",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.verify.bind(controller)

    )

);

/*
 Reject Achievement
*/

router.patch(

    "/:id/reject",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.reject.bind(controller)

    )

);

export default router;
