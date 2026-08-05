import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { attendanceContainer } from "../../application/container/AttendanceContainer.js";

export class AttendanceController {

    async openSession(

        req: Request,

        res: Response

    ) {

        const session =

            await attendanceContainer

                .openSession

                .execute(

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            session,

            "Attendance session opened successfully.",

            201

        );

    }

    async getSession(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid attendance session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const session =

            await attendanceContainer

                .getSession

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            session,

            "Attendance session fetched successfully."

        );

    }

    async getQrToken(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const token =

            await attendanceContainer

                .getQrToken

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            token,

            "QR token fetched successfully."

        );

    }

    async markViaQr(

        req: Request,

        res: Response

    ) {

        const record =

            await attendanceContainer

                .markViaQr

                .execute(

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body,

                    req.ip ?? "Unknown",

                    req.headers["user-agent"] ?? "Unknown"

                );

        return ApiResponse.success(

            res,

            record,

            "Attendance marked successfully.",

            201

        );

    }

    async markManually(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const record =

            await attendanceContainer

                .markManually

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            record,

            "Attendance marked successfully."

        );

    }

    async closeSession(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const session =

            await attendanceContainer

                .closeSession

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            session,

            "Attendance session closed successfully."

        );

    }

    async requestCorrection(

        req: Request,

        res: Response

    ) {

        const record =

            await attendanceContainer

                .requestCorrection

                .execute(

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            record,

            "Attendance correction requested successfully.",

            201

        );

    }

    async reviewCorrection(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid attendance record id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const record =

            await attendanceContainer

                .reviewCorrection

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            record,

            "Attendance correction reviewed successfully."

        );

    }

    async getSuspiciousPatterns(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid attendance session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const thresholdParam = req.query.threshold;

        const threshold =
            typeof thresholdParam === "string" && thresholdParam.length > 0
                ? Number(thresholdParam)
                : undefined;

        const patterns =

            await attendanceContainer

                .getSuspiciousPatterns

                .execute(

                    id,

                    req.user!.organizationId,

                    threshold

                );

        return ApiResponse.success(

            res,

            patterns,

            "Suspicious attendance patterns fetched successfully."

        );

    }

    async getSessionRecords(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid attendance session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const records =

            await attendanceContainer

                .getSessionRecords

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            records,

            "Session attendance records fetched successfully."

        );

    }

    async getMyRecords(

        req: Request,

        res: Response

    ) {

        const records =

            await attendanceContainer

                .getMyRecords

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            records,

            "Your attendance records fetched successfully."

        );

    }

}
