import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { chatContainer } from "../../application/container/ChatContainer.js";

export class MessageController {

    async markRead(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid message id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const message =

            await chatContainer

                .markMessageRead

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            message,

            "Message marked as read."

        );

    }

}
