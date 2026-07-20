import { Chat } from "../../domain/entities/Chat.js";

export interface IChatRepository {

    create(
        chat: Chat
    ): Promise<Chat>;

    findById(
        id: string
    ): Promise<Chat | null>;

    findByParticipant(
        organizationId: string,
        userId: string
    ): Promise<Chat[]>;

    findDirectChatBetween(
        organizationId: string,
        userIdA: string,
        userIdB: string
    ): Promise<Chat | null>;

    save(
        chat: Chat
    ): Promise<Chat>;

}
