import { InterviewRound } from "../../domain/entities/InterviewRound.js";

import { InterviewRoundModel } from "../persistence/InterviewRoundModel.js";
import { InterviewRoundMapper } from "../mappers/InterviewRoundMapper.js";

import { IInterviewRoundRepository } from "./IInterviewRoundRepository.js";

export class InterviewRoundRepository
implements IInterviewRoundRepository {

    async create(

        round: InterviewRound

    ): Promise<InterviewRound> {

        const document =
            await InterviewRoundModel.create(

                InterviewRoundMapper.toPersistence(
                    round
                )

            );

        return InterviewRoundMapper.toDomain(
            document
        );

    }

    async findById(

        id: string

    ): Promise<InterviewRound | null> {

        const document =
            await InterviewRoundModel.findById(id);

        return document
            ? InterviewRoundMapper.toDomain(document)
            : null;

    }

    async findByApplication(

        applicationId: string

    ): Promise<InterviewRound[]> {

        const documents =
            await InterviewRoundModel
                .find({ applicationId })
                .sort({ sequence: 1 });

        return documents.map(
            document => InterviewRoundMapper.toDomain(document)
        );

    }

    async save(

        round: InterviewRound

    ): Promise<InterviewRound> {

        const document =
            await InterviewRoundModel.findByIdAndUpdate(

                round.id,

                InterviewRoundMapper.toPersistence(
                    round
                ),

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!document) {

            throw new Error(
                "Interview round not found."
            );

        }

        return InterviewRoundMapper.toDomain(
            document
        );

    }

}
