import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteBadgeUseCase {

    constructor(

        private readonly repository: IBadgeRepository

    ) {}

    async execute(

        id: string

    ): Promise<void> {

        const badge =

            await this.repository.findById(
                id
            );

        if (!badge) {

            throw new ApiError(

                "Badge not found.",

                HttpStatus.NOT_FOUND

            );

        }

        await this.repository.delete(

            id

        );

    }

}
