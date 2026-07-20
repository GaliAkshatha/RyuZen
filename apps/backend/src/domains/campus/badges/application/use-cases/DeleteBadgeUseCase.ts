import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ICacheService } from "../../../../../shared/core/cache/ICacheService.js";

import { BADGES_CACHE_KEY } from "./GetBadgesUseCase.js";

export class DeleteBadgeUseCase {

    constructor(

        private readonly repository: IBadgeRepository,

        private readonly cacheService: ICacheService

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

        await this.cacheService.delete(

            BADGES_CACHE_KEY

        );

    }

}
