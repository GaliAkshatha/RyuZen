import { ClubMember } from "../../domain/entities/ClubMember.js";

import { ClubMemberRole } from "../../domain/constants/ClubMemberRole.js";
import { ClubMemberStatus } from "../../domain/constants/ClubMemberStatus.js";

import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";
import { IClubMemberRepository } from "../../infrastructure/repositories/IClubMemberRepository.js";

import { ClubMemberResponseMapper } from "../../infrastructure/mappers/ClubMemberResponseMapper.js";

import { AddClubMemberDto } from "../dto/AddClubMemberDto.js";
import { ClubMemberResponseDto } from "../dto/ClubMemberResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AddClubMemberUseCase {

    constructor(

        private readonly repository: IClubRepository,

        private readonly memberRepository: IClubMemberRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        clubId: string,

        organizationId: string,

        dto: AddClubMemberDto

    ): Promise<ClubMemberResponseDto> {

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

        const student =

            await this.studentRepository.findById(
                dto.studentId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Student not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const alreadyMember =

            await this.memberRepository.existsByClubAndStudent(

                clubId,

                dto.studentId

            );

        if (alreadyMember) {

            throw new ApiError(

                "Student is already a member of this club.",

                HttpStatus.CONFLICT

            );

        }

        const role =

            dto.role ?? ClubMemberRole.MEMBER;

        const member = ClubMember.create({

            clubId,

            studentId:
                dto.studentId,

            role,

            joinedAt:
                new Date(),

            status:
                ClubMemberStatus.ACTIVE

        });

        const created =

            await this.memberRepository.create(

                member

            );

        if (role === ClubMemberRole.PRESIDENT) {

            club.setPresident(
                dto.studentId
            );

            await this.repository.save(
                club
            );

        } else if (role === ClubMemberRole.VICE_PRESIDENT) {

            club.setVicePresident(
                dto.studentId
            );

            await this.repository.save(
                club
            );

        }

        return ClubMemberResponseMapper.toDto(

            created

        );

    }

}
