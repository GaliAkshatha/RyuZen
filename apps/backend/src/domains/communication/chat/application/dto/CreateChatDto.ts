import { ChatType } from "../../domain/constants/ChatType.js";

export interface CreateChatDto {

    participantIds: string[];

    type?: ChatType;

}
