import { Router } from "express";

import { CareerScoreController } from "../controllers/CareerScoreController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

const router = Router();

const controller = new CareerScoreController();

/*
 Get My Career Score

 Combines the caller's Leaderboard standing, Resume ATS score,
 career-profile completeness, and verified Achievements into a
 single overall score.
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.get.bind(controller)

    )

);

export default router;
