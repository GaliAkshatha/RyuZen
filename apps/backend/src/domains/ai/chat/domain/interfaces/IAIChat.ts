import { IAIChatMessage } from "./IAIChatMessage.js";

export interface IAIChat {

    id?: string;

    userId: string;

    messages: IAIChatMessage[];

    context?: string;

    createdAt?: Date;

}
