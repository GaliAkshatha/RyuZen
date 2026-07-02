import express from "express";

import {

    getNotifications,

} from "../controllers/notificationController.js";

import authenticate from "../../auth/middleware/authenticate.js";

const router = express.Router();

router.use(

    authenticate

);

/**
 * GET /notifications
 */
router.get(

    "/",

    getNotifications

);

export default router;