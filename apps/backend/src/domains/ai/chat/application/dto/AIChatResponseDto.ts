import { AIChatMessageResponseDto } from "./AIChatMessageResponseDto.js";

export interface AIChatResponseDto {

    id: string;

    userId: string;

    messages: AIChatMessageResponseDto[];

    context?: string;

    createdAt?: Date;

}
