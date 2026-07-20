import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { aiChatContainer } from "../../application/container/AIChatContainer.js";

export class AIChatController {

    async sendMessage(

        req: Request,

        res: Response

    ) {

        const chat =

            await aiChatContainer

                .sendAIChatMessage

                .execute(

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            chat,

            "AI chat message sent successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const chats =

            await aiChatContainer

                .getMyAIChats

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            chats,

            "AI chats fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid AI chat id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const chat =

            await aiChatContainer

                .getAIChat

                .execute(

                    id,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            chat,

            "AI chat fetched successfully."

        );

    }

}
