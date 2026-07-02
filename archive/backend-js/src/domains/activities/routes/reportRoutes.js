import express from "express";

import {

    exportCSV,

} from "../controllers/reportController.js";

import authenticate from "../../auth/middleware/authenticate.js";

import authorize from "../../auth/middleware/authorize.js";

import {

    USER_ROLE,

} from "../../users/constants/userConstants.js";

const router = express.Router();

router.use(authenticate);

router.get(

    "/activities/:id/csv",

    authorize(

        USER_ROLE.ADMIN,

        USER_ROLE.TEACHER

    ),

    exportCSV

);

export default router;