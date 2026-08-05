import { Router } from "express";

import { AuthController } from "../controllers/AuthController.js";

import { asyncHandler } from "../../../../shared/core/middleware/index.js";
import { auditLogger } from "../../../../shared/core/middleware/auditLogger.js";

import { validate } from "../../../../shared/core/validation/index.js";

import { authenticate } from "../../../../shared/core/middleware/index.js";

import { authRateLimiter } from "../../../../shared/core/middleware/index.js";

import {

    LoginSchema,

} from "../validators/LoginSchema.js";

import {

    RefreshTokenSchema,

} from "../validators/RefreshTokenSchema.js";

import {

    ForgotPasswordSchema,

} from "../validators/ForgotPasswordSchema.js";

import {

    ResetPasswordSchema,

} from "../validators/ResetPasswordSchema.js";

import {

    ChangePasswordSchema,

} from "../validators/ChangePasswordSchema.js";

import {

    UpdateProfileSchema,

} from "../validators/UpdateProfileSchema.js";

import {

    VerifyInvitationSchema,

} from "../validators/VerifyInvitationSchema.js";

import {

    AcceptInvitationSchema,

} from "../validators/AcceptInvitationSchema.js";

const router = Router();

const controller =

    new AuthController();

router.post(

    "/login",

    authRateLimiter,

    validate(LoginSchema),

    asyncHandler(

        controller.login.bind(controller)

    )

);

router.get(

    "/profile",

    authenticate,

    asyncHandler(

        controller.profile.bind(controller)

    )

);

router.patch(

    "/profile",

    authenticate,

    validate(UpdateProfileSchema),

    asyncHandler(

        controller.updateProfile.bind(controller)

    )

);

router.post(

    "/refresh",

    authRateLimiter,

    validate(RefreshTokenSchema),

    asyncHandler(

        controller.refresh.bind(controller)

    )

);

router.post(

    "/forgot-password",

    authRateLimiter,

    validate(ForgotPasswordSchema),

    asyncHandler(

        controller.forgotPassword.bind(controller)

    )

);

router.post(

    "/reset-password",

    authRateLimiter,

    validate(ResetPasswordSchema),

    asyncHandler(

        controller.resetPassword.bind(controller)

    )

);

router.patch(

    "/change-password",

    authenticate,

    validate(ChangePasswordSchema),

    auditLogger("PASSWORD_CHANGED", "User"),

    asyncHandler(

        controller.changePassword.bind(controller)

    )

);

/*
 Verify Invitation - public, unauthenticated (the user hasn't set a
 password yet). Rate-limited like every other auth endpoint.
*/

router.post(

    "/verify-invitation",

    authRateLimiter,

    validate(VerifyInvitationSchema),

    asyncHandler(

        controller.verifyInvitation.bind(controller)

    )

);

/*
 Accept Invitation - sets the password and activates the account.
*/

router.post(

    "/accept-invitation",

    authRateLimiter,

    validate(AcceptInvitationSchema),

    asyncHandler(

        controller.acceptInvitation.bind(controller)

    )

);

/*
 Logout Current Device - revokes the session tied to the access
 token's sessionId claim.
*/

router.post(

    "/logout",

    authenticate,

    auditLogger("LOGOUT", "Session"),

    asyncHandler(

        controller.logout.bind(controller)

    )

);

/*
 Logout All Devices
*/

router.post(

    "/logout-all",

    authenticate,

    asyncHandler(

        controller.logoutAllDevices.bind(controller)

    )

);

/*
 View Active Sessions
*/

router.get(

    "/sessions",

    authenticate,

    asyncHandler(

        controller.getSessions.bind(controller)

    )

);

/*
 Revoke An Individual Session - logging out one specific device.
*/

router.post(

    "/sessions/:id/revoke",

    authenticate,

    asyncHandler(

        controller.revokeSession.bind(controller)

    )

);

export default router;