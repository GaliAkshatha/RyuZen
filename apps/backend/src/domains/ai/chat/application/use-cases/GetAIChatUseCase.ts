import { IAIChatRepository } from "../../infrastructure/repositories/IAIChatRepository.js";

import { AIChatResponseMapper } from "../../infrastructure/mappers/AIChatResponseMapper.js";

import { AIChatResponseDto } from "../dto/AIChatResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetAIChatUseCase {

    constructor(

        private readonly repository: IAIChatRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<AIChatResponseDto> {

        const chat =

            await this.repository.findById(
                id
            );

        if (

            !chat ||
            chat.userId !== userId

        ) {

            throw new ApiError(

                "AI chat session not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return AIChatResponseMapper.toDto(

            chat

        );

    }

}
