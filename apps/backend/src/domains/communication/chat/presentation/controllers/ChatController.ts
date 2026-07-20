import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { chatContainer } from "../../application/container/ChatContainer.js";

export class ChatController {

    async create(

        req: Request,

        res: Response

    ) {

        const chat =

            await chatContainer

                .createChat

                .execute(

                    req.body,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            chat,

            "Chat created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const chats =

            await chatContainer

                .getMyChats

                .execute(

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            chats,

            "Chats fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid chat id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const chat =

            await chatContainer

                .getChat

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            chat,

            "Chat fetched successfully."

        );

    }

    async sendMessage(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid chat id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const message =

            await chatContainer

                .sendMessage

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            message,

            "Message sent successfully.",

            201

        );

    }

    async listMessages(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid chat id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const messages =

            await chatContainer

                .getChatMessages

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            messages,

            "Messages fetched successfully."

        );

    }

}
