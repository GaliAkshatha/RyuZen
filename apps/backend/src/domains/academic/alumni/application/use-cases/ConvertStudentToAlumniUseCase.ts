import { CreateAlumniUseCase } from "./CreateAlumniUseCase.js";

import { AlumniResponseDto } from "../dto/AlumniResponseDto.js";
import { ConvertStudentToAlumniDto } from "../dto/ConvertStudentToAlumniDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";
import { CreateAuditLogUseCase } from "../../../../platform/audit/application/use-cases/CreateAuditLogUseCase.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Student -> Placement -> Employee -> Alumni -> Mentor -> Recruiter."
 * A real, admin-initiated lifecycle action (manual, not automatic -
 * no real "graduation" event exists anywhere in the system to trigger
 * this honestly, and fabricating one would be dishonest). Orchestrates
 * the same real, already-proven pieces rather than duplicating them:
 * changes the real User's role, archives the real Student record
 * (mirrors ArchiveStudentUseCase), and calls the real, unmodified
 * CreateAlumniUseCase to create the alumni profile - the exact same
 * code path an admin manually creating an alumni record would use.
 *
 * A real growth event is emitted - this is a genuine, significant
 * milestone in the student's real journey, not a routine admin edit.
 */
export class ConvertStudentToAlumniUseCase {

    constructor(

        private readonly studentRepository: IStudentRepository,

        private readonly userRepository: IUserRepository,

        private readonly createAlumni: CreateAlumniUseCase,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase,

        private readonly createAuditLog: CreateAuditLogUseCase

    ) {}

    async execute(

        studentId: string,

        organizationId: string,

        dto: ConvertStudentToAlumniDto,

        convertedBy: string

    ): Promise<AlumniResponseDto> {

        const student =

            await this.studentRepository.findById(
                studentId
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

        const user =

            await this.userRepository.findById(
                student.userId
            );

        if (!user) {

            throw new ApiError(

                "The user account for this student was not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (user.role !== UserRole.STUDENT) {

            throw new ApiError(

                "Only an active student can be converted to alumni.",

                HttpStatus.BAD_REQUEST

            );

        }

        await this.userRepository.updateRole(

            user.id!,

            UserRole.ALUMNI

        );

        student.archive();

        await this.studentRepository.save(
            student
        );

        const alumniProfile =

            await this.createAlumni.execute(

                {
                    userId: user.id!,
                    graduationYear: dto.graduationYear,
                    company: dto.company,
                    designation: dto.designation
                },

                organizationId

            );

        await this.recordGrowthEvent.execute({

            organizationId,

            studentId,

            domain: "academic",

            eventType: "STUDENT_BECAME_ALUMNI",

            evidence: { entityType: "Alumni", entityId: alumniProfile.id },

            verifiedBy: convertedBy

        }).catch(() => {
            // Growth Profile recording must never break a real, already-completed conversion.
        });

        await this.createAuditLog.execute({

            organizationId,

            userId: convertedBy,

            action: "STUDENT_CONVERTED_TO_ALUMNI",

            entityType: "User",

            entityId: user.id!,

            method: "POST",

            path: "/api/v1/alumni/convert",

            statusCode: 201

        }).catch(() => {
            // Audit logging must never break a real, already-completed conversion.
        });

        return alumniProfile;

    }

}
