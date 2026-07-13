import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { eventContainer } from "../../application/container/EventContainer.js";

export class EventController {

    async create(

        req: Request,

        res: Response

    ) {

        const event =

            await eventContainer

                .createEvent

                .execute(

                    req.body,

                    req.user!

                );

        return ApiResponse.success(

            res,

            event,

            "Event created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const { clubId, status } = req.query;

        const events =

            await eventContainer

                .getEvents

                .execute(

                    req.user!.organizationId,

                    {

                        clubId:
                            typeof clubId === "string"
                                ? clubId
                                : undefined,

                        status:
                            typeof status === "string"
                                ? status
                                : undefined

                    }

                );

        return ApiResponse.success(

            res,

            events,

            "Events fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const event =

            await eventContainer

                .getEvent

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            event,

            "Event fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const event =

            await eventContainer

                .updateEvent

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            event,

            "Event updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await eventContainer

            .deleteEvent

            .execute(

                id,

                req.user!.organizationId

            );

        return ApiResponse.success(

            res,

            null,

            "Event deleted successfully."

        );

    }

    async publish(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const event =

            await eventContainer

                .publishEvent

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            event,

            "Event published successfully."

        );

    }

    async register(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const registration =

            await eventContainer

                .registerForEvent

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            registration,

            "Registered for event successfully.",

            201

        );

    }

    async listRegistrations(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const registrations =

            await eventContainer

                .getEventRegistrations

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            registrations,

            "Event registrations fetched successfully."

        );

    }

    async markAttendance(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const registration =

            await eventContainer

                .markAttendance

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            registration,

            "Attendance marked successfully."

        );

    }

    async submitFeedback(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const registration =

            await eventContainer

                .submitEventFeedback

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            registration,

            "Feedback submitted successfully.",

            201

        );

    }

    async issueCertificates(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid event id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const registrations =

            await eventContainer

                .issueCertificates

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            registrations,

            "Certificates issued successfully."

        );

    }

}
