import { ChatRepository } from "../../infrastructure/repositories/ChatRepository.js";

import { MessageRepository } from "../../infrastructure/repositories/MessageRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { CreateChatUseCase } from "../use-cases/CreateChatUseCase.js";
import { GetChatUseCase } from "../use-cases/GetChatUseCase.js";
import { GetMyChatsUseCase } from "../use-cases/GetMyChatsUseCase.js";
import { SendMessageUseCase } from "../use-cases/SendMessageUseCase.js";
import { GetChatMessagesUseCase } from "../use-cases/GetChatMessagesUseCase.js";
import { MarkMessageReadUseCase } from "../use-cases/MarkMessageReadUseCase.js";

const chatRepository = new ChatRepository();

const messageRepository = new MessageRepository();

const userRepository = new UserRepository();

export const chatContainer = {

    createChat:

        new CreateChatUseCase(

            chatRepository,

            userRepository

        ),

    getChat:

        new GetChatUseCase(
            chatRepository
        ),

    getMyChats:

        new GetMyChatsUseCase(
            chatRepository
        ),

    sendMessage:

        new SendMessageUseCase(

            messageRepository,

            chatRepository

        ),

    getChatMessages:

        new GetChatMessagesUseCase(

            messageRepository,

            chatRepository

        ),

    markMessageRead:

        new MarkMessageReadUseCase(

            messageRepository,

            chatRepository

        )

};
