import express from "express";

import {

    getAcademicLeaderboard,

} from "../controllers/leaderboardController.js";

import authenticate

from "../../auth/middleware/authenticate.js";

const router = express.Router();

router.use(

    authenticate

);

router.get(

    "/academic",

    getAcademicLeaderboard

);

export default router;