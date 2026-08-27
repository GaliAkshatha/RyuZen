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

import { certificationFileUpload } from "../../../../../shared/core/upload/certificationFileUpload.js";

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

/*
 Verify Certification - Faculty/Org Admin/Super Admin confirming a
 real certification is legitimate. Real cross-org protection enforced
 inside VerifyCertificationUseCase.
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
 Upload Certification File - STUDENT only, and only the real owner of
 this certification (enforced inside UploadCertificationFileUseCase).
 certificationFileUpload handles real disk storage + a real 10MB
 limit + real MIME filtering (PDF/JPEG/PNG/WEBP).
*/

router.post(

    "/:id/file",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    certificationFileUpload.single("file"),

    asyncHandler(

        controller.uploadFile.bind(controller)

    )

);

export default router;
