import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { connectionContainer } from "../../application/container/ConnectionContainer.js";

function requireParam(value: string | undefined, name: string): string {

    if (!value || Array.isArray(value)) {
        throw new ApiError(`Invalid ${name}.`, HttpStatus.BAD_REQUEST);
    }

    return value;

}

export class ConnectionController {

    async getPeople(req: Request, res: Response) {

        const people = await connectionContainer.getConnectableUsers.execute(

            req.user!.organizationId,
            req.user!.userId

        );

        return ApiResponse.success(res, people, "People fetched successfully.");

    }

    async send(req: Request, res: Response) {

        const request = await connectionContainer.sendRequest.execute(

            req.user!.organizationId,
            req.user!.userId,
            req.body

        );

        return ApiResponse.success(res, request, "Connection request sent successfully.", 201);

    }

    async respond(req: Request, res: Response) {

        const id = requireParam(req.params.id, "connection request id");

        const request = await connectionContainer.respondToRequest.execute(

            id,
            req.user!.organizationId,
            req.user!.userId,
            req.body

        );

        return ApiResponse.success(res, request, "Connection request updated successfully.");

    }

    async getPending(req: Request, res: Response) {

        const requests = await connectionContainer.getPendingRequests.execute(req.user!.userId);

        return ApiResponse.success(res, requests, "Pending requests fetched successfully.");

    }

    async getMyConnections(req: Request, res: Response) {

        const connections = await connectionContainer.getMyConnections.execute(req.user!.userId);

        return ApiResponse.success(res, connections, "Connections fetched successfully.");

    }

}
