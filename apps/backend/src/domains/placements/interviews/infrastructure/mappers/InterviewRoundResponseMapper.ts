import { InterviewRound } from "../../domain/entities/InterviewRound.js";

import { InterviewRoundResponseDto } from "../../application/dto/InterviewRoundResponseDto.js";

export class InterviewRoundResponseMapper {

    static toDto(

        round: InterviewRound

    ): InterviewRoundResponseDto {

        return {

            id:
                round.id!,

            applicationId:
                round.applicationId,

            roundType:
                round.roundType,

            sequence:
                round.sequence,

            scheduledAt:
                round.scheduledAt,

            interviewerId:
                round.interviewerId,

            status:
                round.status,

            evaluation:
                round.evaluation,

            completedAt:
                round.completedAt,

            createdAt:
                round.createdAt

        };

    }

}
