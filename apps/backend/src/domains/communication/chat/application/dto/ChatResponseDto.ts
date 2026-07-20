import { ChatType } from "../../domain/constants/ChatType.js";

export interface ChatResponseDto {

    id: string;

    organizationId: string;

    participants: string[];

    type: ChatType;

    createdAt?: Date;

}
