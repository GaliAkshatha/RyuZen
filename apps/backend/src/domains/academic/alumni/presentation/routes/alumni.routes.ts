import { Router } from "express";

import { AlumniController } from "../controllers/AlumniController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateAlumniSchema } from "../validators/CreateAlumniSchema.js";
import { InviteAlumniSchema } from "../validators/InviteAlumniSchema.js";
import { UpdateAlumniSchema } from "../validators/UpdateAlumniSchema.js";

const router = Router();

const controller = new AlumniController();

/*
 Create Alumni
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateAlumniSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 Invite Alumni
*/

router.post(

    "/invite",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        InviteAlumniSchema

    ),

    asyncHandler(

        controller.invite.bind(controller)

    )

);

/*
 List Alumni
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
 Get Alumni
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

/*
 Update Alumni
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateAlumniSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Verify Alumni
*/

router.patch(

    "/:id/verify",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.verify.bind(controller)

    )

);

export default router;
