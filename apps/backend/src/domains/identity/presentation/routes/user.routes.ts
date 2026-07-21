import { Router } from "express";

import { UserController } from "../controllers/UserController.js";

import { asyncHandler } from "../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../shared/core/middleware/index.js";

import { validate } from "../../../../shared/core/validation/index.js";

import { UserRole } from "../../domain/constants/UserRole.js";

import { GrantPermissionSchema } from "../validators/GrantPermissionSchema.js";

import { RevokePermissionSchema } from "../validators/RevokePermissionSchema.js";

const router = Router();

const controller = new UserController();

/*
 Grant Permission
*/

router.post(

    "/:userId/permissions/grant",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        GrantPermissionSchema

    ),

    asyncHandler(

        controller.grantPermission.bind(controller)

    )

);

/*
 Revoke Permission
*/

router.post(

    "/:userId/permissions/revoke",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        RevokePermissionSchema

    ),

    asyncHandler(

        controller.revokePermission.bind(controller)

    )

);

export default router;
