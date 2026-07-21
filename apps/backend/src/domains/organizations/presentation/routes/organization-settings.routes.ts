import { Router } from "express";

import { OrganizationSettingsController } from "../controllers/OrganizationSettingsController.js";

import { asyncHandler } from "../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../shared/core/middleware/index.js";

import { validate } from "../../../../shared/core/validation/index.js";

import { UserRole } from "../../../identity/domain/constants/UserRole.js";

import { UpdateOrganizationSettingsSchema } from "../validators/UpdateOrganizationSettingsSchema.js";

const router = Router();

const controller = new OrganizationSettingsController();

/*
 Get Organization Settings
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.get.bind(controller)

    )

);

/*
 Update Organization Settings
*/

router.patch(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateOrganizationSettingsSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

export default router;
