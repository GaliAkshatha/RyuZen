import { Router } from "express";

import { CertificationController } from "../controllers/CertificationController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreateCertificationSchema,
    UpdateCertificationSchema
} from "../validators/CertificationSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new CertificationController();

/*
 Create Certification - restricted to STUDENT, the real intended
 audience. Previously open to any authenticated role.
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        CreateCertificationSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Certifications
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
 List Certifications For A User - deliberately open to any
 authenticated role, since viewing another user's real certifications
 is a legitimate read.
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 Get Certification
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Certification
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        UpdateCertificationSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Certification
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
