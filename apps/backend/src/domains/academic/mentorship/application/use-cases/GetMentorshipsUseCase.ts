import { IMentorshipRepository } from "../../infrastructure/repositories/IMentorshipRepository.js";

import {
    IFacultyRepository,
} from "../../../faculty/infrastructure/repositories/IFacultyRepository.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { MentorshipResponseMapper } from "../../infrastructure/mappers/MentorshipResponseMapper.js";

import { MentorshipResponseDto } from "../dto/MentorshipResponseDto.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

export interface GetMentorshipsFilterDto {

    studentId?: string;

    facultyId?: string;

    status?: string;

}

/**
 * SECURITY FIX (preserved): previously trusted a client-provided
 * facultyId filter with no verification it belonged to the caller -
 * any Faculty user could pass another real faculty's id via
 * ?facultyId= and see their mentee list. When the caller is FACULTY,
 * their own real facultyId (resolved server-side via
 * IFacultyRepository, never from the request) always overrides
 * whatever facultyId was provided. ORG_ADMIN/SUPER_ADMIN retain full
 * filtering by any facultyId, matching their existing broader access.
 *
 * Also enriches each entry with the real student's name/usn, the same
 * fix already applied to GetLeaderboardUseCase - Faculty cannot call
 * GET /students (admin-only, confirmed directly), so without this the
 * "My Students" roster could only ever show a raw student id.
 */
export class GetMentorshipsUseCase {

    constructor(

        private readonly repository: IMentorshipRepository,

        private readonly facultyRepository: IFacultyRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly userRepository: IUserRepository

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

        const dtos: MentorshipResponseDto[] = [];

        for (const mentorship of mentorships) {

            const dto =

                MentorshipResponseMapper.toDto(
                    mentorship
                );

            const student =

                await this.studentRepository.findById(
                    dto.studentId
                );

            if (student) {

                dto.studentUsn = student.usn;

                dto.studentUserId = student.userId;

                const user =

                    await this.userRepository.findById(
                        student.userId
                    );

                if (user) {

                    dto.studentName = user.name;

                }

            }

            dtos.push(dto);

        }

        return dtos;

    }

}
