export interface MessageResponseDto {

    id: string;

    chatId: string;

    senderId: string;

    message: string;

    attachments: string[];

    isRead: boolean;

    createdAt?: Date;

}
