import { Router } from "express";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";

import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { DepartmentController } from "../controllers/DepartmentController.js";

import { CreateDepartmentSchema } from "../validators/CreateDepartmentSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new DepartmentController();

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateDepartmentSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.getAll.bind(controller)

    )

);

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

export default router;