export interface IMessage {

    id?: string;

    chatId: string;

    senderId: string;

    message: string;

    attachments: string[];

    readBy: string[];

    createdAt?: Date;

}
