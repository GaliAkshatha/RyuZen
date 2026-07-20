import { Message } from "../../domain/entities/Message.js";

export interface IMessageRepository {

    create(
        message: Message
    ): Promise<Message>;

    findById(
        id: string
    ): Promise<Message | null>;

    findByChat(
        chatId: string
    ): Promise<Message[]>;

    save(
        message: Message
    ): Promise<Message>;

}
