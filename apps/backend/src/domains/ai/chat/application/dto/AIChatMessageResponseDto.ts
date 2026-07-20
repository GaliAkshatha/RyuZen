import { AIChatRole } from "../../domain/constants/AIChatRole.js";

export interface AIChatMessageResponseDto {

    role: AIChatRole;

    content: string;

    timestamp: Date;

}
