import { Router } from "express";

import { ClubController } from "../controllers/ClubController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateClubSchema } from "../validators/CreateClubSchema.js";
import { UpdateClubSchema } from "../validators/UpdateClubSchema.js";
import { AssignAdvisorSchema } from "../validators/AssignAdvisorSchema.js";
import { AddClubMemberSchema } from "../validators/AddClubMemberSchema.js";

const router = Router();

const controller = new ClubController();

/*
 Create Club
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateClubSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Clubs
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Club
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Club
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateClubSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Club
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

/*
 Assign Advisor
*/

router.patch(

    "/:id/advisor",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        AssignAdvisorSchema

    ),

    asyncHandler(

        controller.assignAdvisor.bind(controller)

    )

);

/*
 List Club Members
*/

router.get(

    "/:id/members",

    authenticate,

    asyncHandler(

        controller.listMembers.bind(controller)

    )

);

/*
 Add Club Member
*/

router.post(

    "/:id/members",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        AddClubMemberSchema

    ),

    asyncHandler(

        controller.addMember.bind(controller)

    )

);

/*
 Remove Club Member
*/

router.delete(

    "/:id/members/:memberId",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.removeMember.bind(controller)

    )

);

export default router;
