import express from "express";

import {

    createActivity,

    updateActivity,

    publishActivity,

    closeActivity,

    deleteActivity,

} from "../controllers/activityController.js";

import authenticate from "../../auth/middleware/authenticate.js";

import authorize from "../../auth/middleware/authorize.js";

import validate from "../../../shared/middleware/validate.js";

import {

    createActivityValidator,

    updateActivityValidator,

} from "../validators.js";

import {

    USER_ROLE,

} from "../../users/constants/userConstants.js";

const router = express.Router();

router.use(authenticate);

router.post(

    "/",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    createActivityValidator,

    validate,

    createActivity

);

router.put(

    "/:id",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    updateActivityValidator,

    validate,

    updateActivity

);

router.patch(

    "/:id/publish",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    publishActivity

);

router.patch(

    "/:id/close",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    closeActivity

);

router.delete(

    "/:id",

    authorize(

        USER_ROLE.ADMIN

    ),

    deleteActivity

);

export default router;