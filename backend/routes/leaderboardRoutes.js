import express from "express";

import {
    getAcademicLeaderboard,
}
from "../controllers/leaderboardController.js";

const router = express.Router();

router.get(
    "/academic",
    getAcademicLeaderboard
);

export default router;