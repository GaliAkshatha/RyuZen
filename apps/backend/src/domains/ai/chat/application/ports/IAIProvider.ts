import { IAIChatMessage } from "../../domain/interfaces/IAIChatMessage.js";

export interface IAIProvider {

    generateReply(

        messages: IAIChatMessage[],

        context?: string

    ): Promise<string>;

}
