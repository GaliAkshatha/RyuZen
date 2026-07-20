import { AIChatRole } from "../constants/AIChatRole.js";

export interface IAIChatMessage {

    role: AIChatRole;

    content: string;

    timestamp: Date;

}
