import { Router } from "express";

import { InvitationController } from "../controllers/InvitationController.js";

import { asyncHandler } from "../../../../shared/core/middleware/asyncHandler.js";
import { auditLogger } from "../../../../shared/core/middleware/auditLogger.js";
import {
    authenticate,
    authorizePermission
} from "../../../../shared/core/middleware/index.js";

import { validate } from "../../../../shared/core/validation/index.js";

import { InviteUserSchema } from "../validators/InviteUserSchema.js";

import { UserRole } from "../../domain/constants/UserRole.js";

const router = Router();

const controller = new InvitationController();

/*
 All invitation-management actions are ORG_ADMIN only, matching the
 brief's business rule directly: "Only ORG_ADMIN can create
 organization users." ORG_ADMIN can invite any of Faculty/Student/
 Alumni/Placement Admin/Recruiter. PLACEMENT_ADMIN is also allowed on
 this route now, but InviteUserUseCase itself restricts them to
 RECRUITER only - they own company/drive relationships and approve
 real recruiter contacts, matching "Recruiters gain access only after
 approval through the university placement process." Not SUPER_ADMIN
 (who creates ORG_ADMIN and organizations, not organization users).

 Scope note: list/resend/revoke below remain ORG_ADMIN-only for now -
 scoping those correctly to "only the recruiter invitations this
 PLACEMENT_ADMIN can see" needs its own real design pass, not a rushed
 widening alongside this one. A PLACEMENT_ADMIN can invite a recruiter
 today; resending or revoking that invitation currently still requires
 an ORG_ADMIN.
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(InviteUserSchema),

    // Logged as one combined event, not separate "User Created" /
    // "Invitation Sent" entries - InviteUserUseCase creates both
    // atomically in a single action, so two audit rows would describe
    // one real thing as if it were two.
    auditLogger("USER_INVITED", "User"),

    asyncHandler(

        controller.invite.bind(controller)

    )

);

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

router.post(

    "/:id/resend",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    auditLogger("INVITATION_RESENT", "Invitation"),

    asyncHandler(

        controller.resend.bind(controller)

    )

);

router.post(

    "/:id/revoke",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    auditLogger("INVITATION_REVOKED", "Invitation"),

    asyncHandler(

        controller.revoke.bind(controller)

    )

);

export default router;
