import { Router } from "express";

import { CertificateController } from "../controllers/CertificateController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { IssueCertificateSchema } from "../validators/IssueCertificateSchema.js";

const router = Router();

const controller = new CertificateController();

/*
 Issue Certificate
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    validate(

        IssueCertificateSchema

    ),

    asyncHandler(

        controller.issue.bind(controller)

    )

);

/*
 My Certificates

 Declared before "/:id" to avoid "me" being
 captured as a certificate id route parameter.
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
 List Certificates For A Student
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
 Get Certificate
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

export default router;
