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

/*
 Get A Candidate's Career Score - RECRUITER only, and only for a
 real candidate who has genuinely applied to one of the recruiter's
 own company's drives (checked dynamically inside the controller via
 RecruiterCandidateAccessService, not a static role gate - there's no
 static rule that can express "only THIS recruiter's real
 applicants").
*/

router.get(

    "/:userId",

    authenticate,

    asyncHandler(

        controller.getForCandidate.bind(controller)

    )

);

export default router;
