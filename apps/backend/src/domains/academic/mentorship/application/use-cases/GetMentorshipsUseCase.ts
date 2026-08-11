import { IMentorshipRepository } from "../../infrastructure/repositories/IMentorshipRepository.js";

import {
    IFacultyRepository,
} from "../../../faculty/infrastructure/repositories/IFacultyRepository.js";

import { MentorshipResponseMapper } from "../../infrastructure/mappers/MentorshipResponseMapper.js";

import { MentorshipResponseDto } from "../dto/MentorshipResponseDto.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

export interface GetMentorshipsFilterDto {

    studentId?: string;

    facultyId?: string;

    status?: string;

}

/**
 * SECURITY FIX: previously trusted a client-provided facultyId filter
 * with no verification it belonged to the caller - any Faculty user
 * could pass another faculty's real id via ?facultyId= and see their
 * mentee list. Real fix, not a validation error: when the caller is
 * FACULTY, their own real facultyId (resolved server-side via
 * IFacultyRepository, never from the request) always overrides
 * whatever facultyId was provided. ORG_ADMIN/SUPER_ADMIN retain full
 * filtering by any facultyId, matching their existing broader access.
 */
export class GetMentorshipsUseCase {

    constructor(

        private readonly repository: IMentorshipRepository,

        private readonly facultyRepository: IFacultyRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetMentorshipsFilterDto,

        requesterId: string,

        requesterRole: UserRole

    ): Promise<MentorshipResponseDto[]> {

        let facultyIdFilter = filters.facultyId;

        if (requesterRole === UserRole.FACULTY) {

            const faculty =

                await this.facultyRepository.findByUserId(
                    requesterId
                );

            facultyIdFilter = faculty?.id ?? "__no_faculty_profile__";

        }

        const mentorships =

            await this.repository.findByOrganization(

                organizationId,

                {

                    studentId: filters.studentId,

                    facultyId: facultyIdFilter,

                    status: filters.status

                }

            );

        return mentorships.map(

            mentorship =>

                MentorshipResponseMapper.toDto(
                    mentorship
                )

        );

    }

}
