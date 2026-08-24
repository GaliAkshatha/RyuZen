import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { notificationContainer } from "../../application/container/NotificationContainer.js";

export class NotificationController {

    async send(

        req: Request,

        res: Response

    ) {

        const notification =

            await notificationContainer

                .sendNotification

                .execute(

                    req.body,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.user!.role

                );

        return ApiResponse.success(

            res,

            notification,

            "Notification sent successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const notifications =

            await notificationContainer

                .getMyNotifications

                .execute(

                    req.user!.organizationId,

                    req.user!.userId,

                    req.user!.role

                );

        return ApiResponse.success(

            res,

            notifications,

            "Notifications fetched successfully."

        );

    }

    async markRead(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid notification id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const notification =

            await notificationContainer

                .markNotificationRead

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            notification,

            "Notification marked as read."

        );

    }

}
