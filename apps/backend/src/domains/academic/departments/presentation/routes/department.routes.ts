import { Router } from "express";

import { DepartmentController } from "../controllers/DepartmentController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateDepartmentSchema } from "../validators/CreateDepartmentSchema.js";
import { UpdateDepartmentSchema } from "../validators/UpdateDepartmentSchema.js";
import { AssignHeadOfDepartmentSchema } from "../validators/AssignHeadOfDepartmentSchema.js";

const router = Router();

const controller = new DepartmentController();

/*
 Create Department
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateDepartmentSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Departments
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
 Get Department
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
 Update Department
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateDepartmentSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Department
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

/*
 Assign Head Of Department
*/

router.patch(

    "/:id/head",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        AssignHeadOfDepartmentSchema

    ),

    asyncHandler(

        controller.assignHeadOfDepartment.bind(controller)

    )

);

export default router;