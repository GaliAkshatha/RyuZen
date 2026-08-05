import { Router } from "express";

import { SkillController } from "../controllers/SkillController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    CreateSkillSchema,
    UpdateSkillSchema
} from "../validators/SkillSchema.js";

const router = Router();

const controller = new SkillController();

/*
 Create Skill
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        CreateSkillSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Skills
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Skills For A User
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 AI Skill Extraction - gathers real evidence (Portfolio Projects,
 Certifications, Experience, approved Activity submissions) and
 creates AI_SUGGESTED, unapproved Skill records. Placed before /:id
 since Express would otherwise match "/extract" as an :id param.
*/

router.post(

    "/extract",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.extract.bind(controller)

    )

);

/*
 List Pending Skill Suggestions - AI-suggested skills the student
 hasn't reviewed yet. Same routing-order reasoning as /extract above.
*/

router.get(

    "/suggestions/pending",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.listPending.bind(controller)

    )

);

/*
 Get Skill - deliberately left open to any authenticated role, not
 just STUDENT: a faculty member reviewing a skill before calling
 /verify needs to fetch it first.
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Skill
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        UpdateSkillSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Skill
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

/*
 Approve Skill Suggestion - the student confirming an AI-suggested
 skill is accurate. Owner-only, enforced in ApproveSkillSuggestionUseCase.
*/

router.patch(

    "/:id/approve",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.approve.bind(controller)

    )

);

/*
 Verify Skill
*/

router.patch(

    "/:id/verify",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.verify.bind(controller)

    )

);

export default router;
