import { Router } from "express";

import { ResumeController } from "../controllers/ResumeController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    CreateResumeTemplateSchema,
    UpdateResumeTemplateSchema
} from "../validators/ResumeTemplateSchema.js";

import { GenerateResumeSchema } from "../validators/GenerateResumeSchema.js";
import { UpdateResumeVisibilitySchema } from "../validators/UpdateResumeVisibilitySchema.js";

const router = Router();

const controller = new ResumeController();

/*
 Get My Resume
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.getMyResume.bind(controller)

    )

);

/*
 Update Resume Visibility
*/

router.patch(

    "/",

    authenticate,

    validate(

        UpdateResumeVisibilitySchema

    ),

    asyncHandler(

        controller.updateVisibility.bind(controller)

    )

);

/*
 Generate Resume
*/

router.post(

    "/generate",

    authenticate,

    validate(

        GenerateResumeSchema

    ),

    asyncHandler(

        controller.generate.bind(controller)

    )

);

/*
 Download Resume
*/

router.get(

    "/download",

    authenticate,

    asyncHandler(

        controller.download.bind(controller)

    )

);

/*
 Create Resume Template (global catalog)
*/

router.post(

    "/templates",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    validate(

        CreateResumeTemplateSchema

    ),

    asyncHandler(

        controller.createTemplate.bind(controller)

    )

);

/*
 List Resume Templates
*/

router.get(

    "/templates",

    authenticate,

    asyncHandler(

        controller.listTemplates.bind(controller)

    )

);

/*
 Get Resume Template
*/

router.get(

    "/templates/:id",

    authenticate,

    asyncHandler(

        controller.getTemplateById.bind(controller)

    )

);

/*
 Update Resume Template
*/

router.patch(

    "/templates/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    validate(

        UpdateResumeTemplateSchema

    ),

    asyncHandler(

        controller.updateTemplate.bind(controller)

    )

);

/*
 Delete Resume Template
*/

router.delete(

    "/templates/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    asyncHandler(

        controller.removeTemplate.bind(controller)

    )

);

export default router;
