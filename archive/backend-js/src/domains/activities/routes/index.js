import express from "express";

import activityRoutes from "./activityRoutes.js";

import submissionRoutes from "./submissionRoutes.js";

import reportRoutes from "./reportRoutes.js";

const router = express.Router();

router.use(

    "/activities",

    activityRoutes

);

router.use(

    "/submissions",

    submissionRoutes

);

router.use(

    "/reports",

    reportRoutes

);

export default router;