import { Router } from "express";

import { PointLedgerController } from "../controllers/PointLedgerController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new PointLedgerController();

/*
 My Point History

 Declared before "/:studentId" to avoid "me" being
 captured as a studentId route parameter (same reasoning as
 leaderboard.routes.ts).
*/

router.get(

    "/me",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.listMine.bind(controller)

    )

);

/*
 Ledger Audit - the full organization chain plus real hash-chain
 verification. Admin/faculty only, matching the same role set
 leaderboard's own admin-level actions use.
*/

router.get(

    "/audit",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,
        UserRole.ORG_ADMIN,
        UserRole.FACULTY

    ),

    asyncHandler(

        controller.audit.bind(controller)

    )

);

/*
 Point History For A Specific Student
*/

router.get(

    "/:studentId",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,
        UserRole.ORG_ADMIN,
        UserRole.FACULTY

    ),

    asyncHandler(

        controller.listForStudent.bind(controller)

    )

);

export default router;
