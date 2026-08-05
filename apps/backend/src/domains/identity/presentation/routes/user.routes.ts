import { Router } from "express";

import { UserController } from "../controllers/UserController.js";

import { asyncHandler } from "../../../../shared/core/middleware/asyncHandler.js";
import { auditLogger } from "../../../../shared/core/middleware/auditLogger.js";
import {
    authenticate,
    authorizePermission
} from "../../../../shared/core/middleware/index.js";

import { validate } from "../../../../shared/core/validation/index.js";

import { UserRole } from "../../domain/constants/UserRole.js";

import { GrantPermissionSchema } from "../validators/GrantPermissionSchema.js";

import { RevokePermissionSchema } from "../validators/RevokePermissionSchema.js";

import { UpdateUserStatusSchema } from "../validators/UpdateUserStatusSchema.js";

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

    auditLogger("PERMISSION_GRANTED", "User"),

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

    auditLogger("PERMISSION_REVOKED", "User"),

    asyncHandler(

        controller.revokePermission.bind(controller)

    )

);

/*
 Unlock User - clears a lockout triggered by too many failed login
 attempts. ORG_ADMIN only, matching "Admin Unlock" from the brief.
*/

router.post(

    "/:userId/unlock",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    auditLogger("ACCOUNT_UNLOCKED", "User"),

    asyncHandler(

        controller.unlockUser.bind(controller)

    )

);

/*
 Update User Status - suspend/reactivate/archive. ORG_ADMIN only,
 matching "ORG_ADMIN can suspend users".
*/

router.patch(

    "/:userId/status",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateUserStatusSchema

    ),

    asyncHandler(

        controller.updateStatus.bind(controller)

    )

);

export default router;
