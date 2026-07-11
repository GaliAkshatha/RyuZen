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

export default router;