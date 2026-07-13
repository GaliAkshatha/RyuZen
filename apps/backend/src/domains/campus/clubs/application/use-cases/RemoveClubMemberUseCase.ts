import { ClubMemberRole } from "../../domain/constants/ClubMemberRole.js";

import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";
import { IClubMemberRepository } from "../../infrastructure/repositories/IClubMemberRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class RemoveClubMemberUseCase {

    constructor(

        private readonly repository: IClubRepository,

        private readonly memberRepository: IClubMemberRepository

    ) {}

    async execute(

        clubId: string,

        organizationId: string,

        memberId: string

    ): Promise<void> {

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

        const member =

            await this.memberRepository.findById(
                memberId
            );

        if (

            !member ||
            member.clubId !== clubId

        ) {

            throw new ApiError(

                "Club member not found.",

                HttpStatus.NOT_FOUND

            );

        }

        await this.memberRepository.delete(

            memberId

        );

        if (

            member.role === ClubMemberRole.PRESIDENT &&
            club.presidentStudentId === member.studentId

        ) {

            club.setPresident(
                undefined
            );

            await this.repository.save(
                club
            );

        } else if (

            member.role === ClubMemberRole.VICE_PRESIDENT &&
            club.vicePresidentStudentId === member.studentId

        ) {

            club.setVicePresident(
                undefined
            );

            await this.repository.save(
                club
            );

        }

    }

}
