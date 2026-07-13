import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";
import { IClubMemberRepository } from "../../infrastructure/repositories/IClubMemberRepository.js";

import { ClubMemberResponseMapper } from "../../infrastructure/mappers/ClubMemberResponseMapper.js";

import { ClubMemberResponseDto } from "../dto/ClubMemberResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetClubMembersUseCase {

    constructor(

        private readonly repository: IClubRepository,

        private readonly memberRepository: IClubMemberRepository

    ) {}

    async execute(

        clubId: string,

        organizationId: string

    ): Promise<ClubMemberResponseDto[]> {

        const club =

            await this.repository.findById(
                clubId
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

        const members =

            await this.memberRepository.findByClub(
                clubId
            );

        return members.map(

            member =>

                ClubMemberResponseMapper.toDto(
                    member
                )

        );

    }

}
