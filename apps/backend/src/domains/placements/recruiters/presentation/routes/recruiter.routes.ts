import { Router } from "express";

import { RecruiterController } from "../controllers/RecruiterController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { CreateRecruiterSchema } from "../validators/CreateRecruiterSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new RecruiterController();

/*
 Create Recruiter Profile - links an already-invited User (role
 RECRUITER) to a real Company. Same admins who can invite a recruiter
 in the first place.
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(CreateRecruiterSchema),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 Get My Recruiter Profile - closes the previously-flagged
 "no GET /recruiters/me self-lookup" gap. Enables a real "My Drives"
 and "My Company" frontend experience without approximating the
 recruiter's own companyId from applicant data.
*/

router.get(

    "/me",

    authenticate,

    authorizePermission(

        UserRole.RECRUITER

    ),

    asyncHandler(

        controller.getMyProfile.bind(controller)

    )

);

/*
 Get My Applicants - RECRUITER-only, resolved from their own real
 Recruiter profile -> real Company -> real Drives -> real Applications.
 Never takes a companyId parameter - a recruiter cannot ask for
 another company's applicants.
*/

router.get(

    "/me/applicants",

    authenticate,

    authorizePermission(

        UserRole.RECRUITER

    ),

    asyncHandler(

        controller.getMyApplicants.bind(controller)

    )

);

/*
 Candidate Discovery - search within this recruiter's own real
 applicant pool (their company's drives). Skill matching is against
 REAL, verified skills only - see SearchApplicantsUseCase.
*/

router.get(

    "/me/applicants/search",

    authenticate,

    authorizePermission(

        UserRole.RECRUITER

    ),

    asyncHandler(

        controller.search.bind(controller)

    )

);

export default router;
