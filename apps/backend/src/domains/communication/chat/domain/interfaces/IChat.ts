import { ChatType } from "../constants/ChatType.js";

export interface IChat {

    id?: string;

    organizationId: string;

    participants: string[];

    type: ChatType;

    createdAt?: Date;

}
