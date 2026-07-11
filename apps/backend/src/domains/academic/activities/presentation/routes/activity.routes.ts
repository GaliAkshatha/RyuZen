import { Router } from "express";

import { ActivityController } from "../controllers/ActivityController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { authenticate, authorizeRoles } from "../../../../../shared/core/middleware/index.js";

import { CreateActivitySchema } from "../validators/CreateActivitySchema.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new ActivityController();

router.post(

    "/",

    authenticate,

    authorizeRoles(

        UserRole.SUPER_ADMIN,
        UserRole.FACULTY
    ),

    validate(CreateActivitySchema),

    asyncHandler(

        controller.create.bind(controller)

    )

);

export default router;