import { Router } from "express";

import { OrganizationController } from "../controllers/OrganizationController.js";

import { asyncHandler } from "../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../shared/core/middleware/index.js";

import { validate } from "../../../../shared/core/validation/index.js";

import { CreateOrganizationSchema } from "../validators/CreateOrganizationSchema.js";

import { UserRole } from "../../../identity/domain/constants/UserRole.js";

import { CreateOrgAdminSchema } from "../validators/CreateOrgAdminSchema.js";

const router = Router();

const controller = new OrganizationController();

/*
 Create Organization
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    validate(

        CreateOrganizationSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

router.post(

    "/:organizationId/admin",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    validate(

        CreateOrgAdminSchema

    ),

    asyncHandler(

        controller.createOrgAdmin.bind(controller)

    )

);

/*
 Get All Organizations
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    asyncHandler(

        controller.getAll.bind(controller)

    )

);

/*
 Get Organization
*/

router.get(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN

    ),

    asyncHandler(

        controller.getById.bind(controller)

    )

);

export default router;