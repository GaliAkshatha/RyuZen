import { Router } from "express";

import { CompanyController } from "../controllers/CompanyController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    CreateCompanySchema,
    UpdateCompanySchema
} from "../validators/CompanySchema.js";

import { UpdateCompanyStatusSchema } from "../validators/UpdateCompanyStatusSchema.js";

const router = Router();

const controller = new CompanyController();

/*
 Create Company

 Per the Role & Permission Matrix, company management is
 ORG_ADMIN only (SUPER_ADMIN is explicitly excluded).
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(

        CreateCompanySchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Companies
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Company
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Company
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(

        UpdateCompanySchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Update Company Status
*/

router.patch(

    "/:id/status",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(

        UpdateCompanyStatusSchema

    ),

    asyncHandler(

        controller.updateStatus.bind(controller)

    )

);

/*
 Delete Company
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
