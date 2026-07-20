import { IEventRepository } from "../../infrastructure/repositories/IEventRepository.js";

import { IEventRegistrationRepository } from "../../infrastructure/repositories/IEventRegistrationRepository.js";

import { startTransaction } from "../../../../../shared/infrastructure/database/index.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteEventUseCase {

    constructor(

        private readonly repository: IEventRepository,

        private readonly registrationRepository: IEventRegistrationRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<void> {

        const event =

            await this.repository.findById(
                id
            );

        if (

            !event ||
            event.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Event not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const session =

            await startTransaction();

        try {

            await this.registrationRepository.deleteByEvent(

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
