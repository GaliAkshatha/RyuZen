import { Router } from "express";

import { SkillController } from "../controllers/SkillController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    CreateSkillSchema,
    UpdateSkillSchema
} from "../validators/SkillSchema.js";

const router = Router();

const controller = new SkillController();

/*
 Create Skill
*/

router.post(

    "/",

    authenticate,

    validate(

        CreateSkillSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Skills
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Skills For A User
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 Get Skill
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Skill
*/

router.patch(

    "/:id",

    authenticate,

    validate(

        UpdateSkillSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Skill
*/

router.delete(

    "/:id",

    authenticate,

    asyncHandler(

        controller.remove.bind(controller)

    )

);

/*
 Verify Skill
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

export default router;
