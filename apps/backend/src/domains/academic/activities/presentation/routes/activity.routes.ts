import { Router } from "express";

import { ActivityController } from "../controllers/ActivityController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { authenticate, authorizeRoles } from "../../../../../shared/core/middleware/index.js";

import { CreateActivitySchema } from "../validators/CreateActivitySchema.js";
import { UpdateActivitySchema } from "../validators/UpdateActivitySchema.js";
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

/*
 List Activities
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Activity
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Activity
*/

router.patch(

    "/:id",

    authenticate,

    authorizeRoles(

        UserRole.SUPER_ADMIN,
        UserRole.FACULTY
    ),

    validate(UpdateActivitySchema),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Publish Activity
*/

router.patch(

    "/:id/publish",

    authenticate,

    authorizeRoles(

        UserRole.SUPER_ADMIN,
        UserRole.FACULTY
    ),

    asyncHandler(

        controller.publish.bind(controller)

    )

);

/*
 Close Activity
*/

router.patch(

    "/:id/close",

    authenticate,

    authorizeRoles(

        UserRole.SUPER_ADMIN,
        UserRole.FACULTY
    ),

    asyncHandler(

        controller.close.bind(controller)

    )

);

/*
 Delete Activity
*/

router.delete(

    "/:id",

    authenticate,

    authorizeRoles(

        UserRole.SUPER_ADMIN,
        UserRole.FACULTY
    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;