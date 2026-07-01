import express from "express";

import {

    submitActivity,

    approveSubmission,

    rejectSubmission,

    markAttendance,

} from "../controllers/submissionController.js";

import authenticate from "../../auth/middleware/authenticate.js";

import authorize from "../../auth/middleware/authorize.js";

import validate from "../../../shared/middleware/validate.js";

import {

    submitActivityValidator,

} from "../validators";

import {

    USER_ROLE,

} from "../../users/constants/userConstants.js";

const router = express.Router();

router.use(authenticate);

router.post(

    "/activities/:id",

    authorize(

        USER_ROLE.STUDENT

    ),

    submitActivityValidator,

    validate,

    submitActivity

);

router.patch(

    "/:id/approve",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    approveSubmission

);

router.patch(

    "/:id/reject",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    rejectSubmission

);

router.patch(

    "/:id/attendance",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    markAttendance

);

export default router;