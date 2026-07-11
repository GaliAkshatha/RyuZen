import { Router } from "express";

import { AuthController } from "../controllers/AuthController.js";

import { asyncHandler } from "../../../../shared/core/middleware/index.js";

import { validate } from "../../../../shared/core/validation/index.js";

import { authenticate } from "../../../../shared/core/middleware/index.js";

import {

    RegisterUserSchema,

} from "../validators/RegisterUserSchema.js";

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

const router = Router();

const controller =

    new AuthController();

router.post(

    "/register",

    validate(RegisterUserSchema),

    asyncHandler(

        controller.register.bind(controller)

    )

);

router.post(

    "/login",

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

    validate(RefreshTokenSchema),

    asyncHandler(

        controller.refresh.bind(controller)

    )

);

router.post(

    "/forgot-password",

    validate(ForgotPasswordSchema),

    asyncHandler(

        controller.forgotPassword.bind(controller)

    )

);

router.post(

    "/reset-password",

    validate(ResetPasswordSchema),

    asyncHandler(

        controller.resetPassword.bind(controller)

    )

);

router.patch(

    "/change-password",

    authenticate,

    validate(ChangePasswordSchema),

    asyncHandler(

        controller.changePassword.bind(controller)

    )

);

export default router;