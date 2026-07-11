import { Router } from "express";

import { FacultyController } from "../controllers/FacultyController.js";

import {
    authenticate,
    authorizePermission,
    asyncHandler
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateFacultySchema } from "../validators/CreateFacultySchema.js";

const router = Router();

const controller = new FacultyController();

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateFacultySchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

export default router;