import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";

import { ClubResponseMapper } from "../../infrastructure/mappers/ClubResponseMapper.js";

import { UpdateClubDto } from "../dto/UpdateClubDto.js";
import { ClubResponseDto } from "../dto/ClubResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateClubUseCase {

    constructor(

        private readonly repository: IClubRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: UpdateClubDto

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

        club.updateDetails(dto);

        const updated =

            await this.repository.save(
                club
            );

        return ClubResponseMapper.toDto(

            updated

        );

    }

}
