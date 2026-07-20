import { IChatRepository } from "../../infrastructure/repositories/IChatRepository.js";

import { ChatResponseMapper } from "../../infrastructure/mappers/ChatResponseMapper.js";

import { ChatResponseDto } from "../dto/ChatResponseDto.js";

export class GetMyChatsUseCase {

    constructor(

        private readonly repository: IChatRepository

    ) {}

    async execute(

        organizationId: string,

        userId: string

    ): Promise<ChatResponseDto[]> {

        const chats =

            await this.repository.findByParticipant(

                organizationId,

                userId

            );

        return chats.map(

            chat =>

                ChatResponseMapper.toDto(
                    chat
                )

        );

    }

}
