import { IStudentRepository } from "../../infrastructure/repositories/IStudentRepository.js";

import { StudentResponseMapper } from "../../infrastructure/mappers/StudentResponseMapper.js";

import { AssignMentorDto } from "../dto/AssignMentorDto.js";
import { StudentResponseDto } from "../dto/StudentResponseDto.js";

import {
    IFacultyRepository,
} from "../../../faculty/infrastructure/repositories/IFacultyRepository.js";

import { FacultyStatus } from "../../../faculty/domain/constants/FacultyStatus.js";

import {
    IMentorshipRepository,
} from "../../../mentorship/infrastructure/repositories/IMentorshipRepository.js";

import { Mentorship } from "../../../mentorship/domain/entities/Mentorship.js";

import { MentorshipStatus } from "../../../mentorship/domain/constants/MentorshipStatus.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AssignMentorUseCase {

    constructor(

        private readonly repository: IStudentRepository,

        private readonly facultyRepository: IFacultyRepository,

        private readonly mentorshipRepository: IMentorshipRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        assignedBy: string,

        dto: AssignMentorDto

    ): Promise<StudentResponseDto> {

        const student =

            await this.repository.findById(
                id
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

        const faculty =

            await this.facultyRepository.findById(
                dto.facultyId
            );

        if (

            !faculty ||
            faculty.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Faculty not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (faculty.status !== FacultyStatus.ACTIVE) {

            throw new ApiError(

                "Mentor must be an active faculty member.",

                HttpStatus.BAD_REQUEST

            );

        }

        const existingActiveMentorship =

            await this.mentorshipRepository.findActiveByStudentId(
                id
            );

        if (existingActiveMentorship) {

            existingActiveMentorship.complete();

            await this.mentorshipRepository.save(

                existingActiveMentorship

            );

        }

        const mentorship = Mentorship.create({

            organizationId,

            facultyId:
                dto.facultyId,

            studentId:
                id,

            assignedBy,

            assignedDate:
                new Date(),

            status:
                MentorshipStatus.ACTIVE

        });

        await this.mentorshipRepository.create(

            mentorship

        );

        student.assignMentor(

            dto.facultyId

        );

        const updated =

            await this.repository.save(
                student
            );

        return StudentResponseMapper.toDto(

            updated

        );

    }

}
