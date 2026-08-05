import { Router } from "express";

import { EducationController } from "../controllers/EducationController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreateEducationSchema,
    UpdateEducationSchema
} from "../validators/EducationSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new EducationController();

/*
 Create Education - restricted to STUDENT, the real intended
 audience. Previously open to any authenticated role.
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        CreateEducationSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Education Entries
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
 List Education Entries For A User - deliberately open to any
 authenticated role, since viewing another user's real education is a
 legitimate read.
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 Get Education
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Education
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        UpdateEducationSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Education
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
