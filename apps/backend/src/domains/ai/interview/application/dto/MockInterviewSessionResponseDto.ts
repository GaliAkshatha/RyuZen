import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { InterviewExchangeResponseDto } from "./InterviewExchangeResponseDto.js";

export interface MockInterviewSessionResponseDto {

    id: string;

    userId: string;

    role: string;

    exchanges: InterviewExchangeResponseDto[];

    status: InterviewSessionStatus;

    feedback?: string;

    score?: number;

    createdAt?: Date;

}
