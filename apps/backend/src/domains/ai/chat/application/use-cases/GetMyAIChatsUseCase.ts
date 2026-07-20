import { IAIChatRepository } from "../../infrastructure/repositories/IAIChatRepository.js";

import { AIChatResponseMapper } from "../../infrastructure/mappers/AIChatResponseMapper.js";

import { AIChatResponseDto } from "../dto/AIChatResponseDto.js";

export class GetMyAIChatsUseCase {

    constructor(

        private readonly repository: IAIChatRepository

    ) {}

    async execute(

        userId: string

    ): Promise<AIChatResponseDto[]> {

        const chats =

            await this.repository.findByUserId(
                userId
            );

        return chats.map(

            chat =>

                AIChatResponseMapper.toDto(
                    chat
                )

        );

    }

}
