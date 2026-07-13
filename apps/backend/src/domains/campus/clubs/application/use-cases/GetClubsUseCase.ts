import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";

import { ClubResponseMapper } from "../../infrastructure/mappers/ClubResponseMapper.js";

import { ClubResponseDto } from "../dto/ClubResponseDto.js";

export class GetClubsUseCase {

    constructor(

        private readonly repository: IClubRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<ClubResponseDto[]> {

        const clubs =

            await this.repository.findByOrganization(
                organizationId
            );

        return clubs.map(

            club =>

                ClubResponseMapper.toDto(
                    club
                )

        );

    }

}
