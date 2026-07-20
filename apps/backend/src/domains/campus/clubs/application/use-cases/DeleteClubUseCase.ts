import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";

import { IClubMemberRepository } from "../../infrastructure/repositories/IClubMemberRepository.js";

import { startTransaction } from "../../../../../shared/infrastructure/database/index.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteClubUseCase {

    constructor(

        private readonly repository: IClubRepository,

        private readonly memberRepository: IClubMemberRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<void> {

        const club =

            await this.repository.findById(
                id
            );

        if (

            !club ||
            club.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Club not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const session =

            await startTransaction();

        try {

            await this.memberRepository.deleteByClub(

                id,

                session

            );

            await this.repository.delete(

                id,

                session

            );

            await session.commitTransaction();

        } catch (error) {

            await session.abortTransaction();

            throw error;

        } finally {

            await session.endSession();

        }

    }

}
