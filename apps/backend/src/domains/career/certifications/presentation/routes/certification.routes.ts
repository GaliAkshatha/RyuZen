import { Router } from "express";

import { CertificationController } from "../controllers/CertificationController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreateCertificationSchema,
    UpdateCertificationSchema
} from "../validators/CertificationSchema.js";

const router = Router();

const controller = new CertificationController();

/*
 Create Certification
*/

router.post(

    "/",

    authenticate,

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

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Certifications For A User
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

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
