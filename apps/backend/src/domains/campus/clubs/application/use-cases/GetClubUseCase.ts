import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";

import { ClubResponseMapper } from "../../infrastructure/mappers/ClubResponseMapper.js";

import { ClubResponseDto } from "../dto/ClubResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetClubUseCase {

    constructor(

        private readonly repository: IClubRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<ClubResponseDto> {

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

        return ClubResponseMapper.toDto(

            club

        );

    }

}
