import { Router } from "express";

import { ExperienceController } from "../controllers/ExperienceController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreateExperienceSchema,
    UpdateExperienceSchema
} from "../validators/ExperienceSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new ExperienceController();

/*
 Create Experience - restricted to STUDENT, the real intended
 audience. Previously open to any authenticated role.
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        CreateExperienceSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Experience Entries
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Experience Entries For A User - deliberately open to any
 authenticated role, since viewing another user's real experience is
 a legitimate read.
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 Get Experience
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Experience
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        UpdateExperienceSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Experience
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

export default router;
