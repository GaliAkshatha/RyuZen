import { IChatRepository } from "../../infrastructure/repositories/IChatRepository.js";

import { ChatResponseMapper } from "../../infrastructure/mappers/ChatResponseMapper.js";

import { ChatResponseDto } from "../dto/ChatResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetChatUseCase {

    constructor(

        private readonly repository: IChatRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        userId: string

    ): Promise<ChatResponseDto> {

        const chat =

            await this.repository.findById(
                id
            );

        if (

            !chat ||
            chat.organizationId !== organizationId ||
            !chat.hasParticipant(userId)

        ) {

            throw new ApiError(

                "Chat not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return ChatResponseMapper.toDto(

            chat

        );

    }

}
