import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { pointLedgerContainer } from "../../application/container/PointLedgerContainer.js";

export class PointLedgerController {

    async listMine(

        req: Request,

        res: Response

    ) {

        const entries =

            await pointLedgerContainer

                .getMyPointHistory

                .execute(

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            entries,

            "Point history fetched successfully."

        );

    }

    async listForStudent(

        req: Request,

        res: Response

    ) {

        const { studentId } = req.params;

        if (!studentId || Array.isArray(studentId)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const entries =

            await pointLedgerContainer

                .getStudentPointHistory

                .execute(

                    req.user!.organizationId,

                    studentId

                );

        return ApiResponse.success(

            res,

            entries,

            "Point history fetched successfully."

        );

    }

    async audit(

        req: Request,

        res: Response

    ) {

        const result =

            await pointLedgerContainer

                .getPointLedgerAudit

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            result,

            result.isValid
                ? "Ledger verified — the chain is intact."
                : "Ledger verification FAILED — the chain has been tampered with or corrupted."

        );

    }

}
