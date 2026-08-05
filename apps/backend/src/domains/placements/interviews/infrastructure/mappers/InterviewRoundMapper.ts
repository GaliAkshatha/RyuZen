import { InterviewRound } from "../../domain/entities/InterviewRound.js";
import { InterviewRoundType } from "../../domain/constants/InterviewRoundType.js";
import { InterviewRoundStatus } from "../../domain/constants/InterviewRoundStatus.js";

import { InterviewRoundDocument } from "../persistence/InterviewRoundModel.js";

export class InterviewRoundMapper {

    static toDomain(

        document: InterviewRoundDocument

    ): InterviewRound {

        return InterviewRound.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            applicationId:
                document.applicationId.toString(),

            roundType:
                document.roundType as InterviewRoundType,

            sequence:
                document.sequence,

            scheduledAt:
                document.scheduledAt,

            interviewerId:
                document.interviewerId?.toString(),

            status:
                document.status as InterviewRoundStatus,

            evaluation:
                document.evaluation,

            completedAt:
                document.completedAt,

            createdAt:
                document.createdAt

        });

    }

    static toPersistence(

        round: InterviewRound

    ) {

        const data =
            round.toObject();

        return {

            organizationId:
                data.organizationId,

            applicationId:
                data.applicationId,

            roundType:
                data.roundType,

            sequence:
                data.sequence,

            scheduledAt:
                data.scheduledAt,

            interviewerId:
                data.interviewerId,

            status:
                data.status,

            evaluation:
                data.evaluation,

            completedAt:
                data.completedAt

        };

    }

}
