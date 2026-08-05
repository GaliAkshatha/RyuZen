import { IPlacementDriveRepository } from "../../infrastructure/repositories/IPlacementDriveRepository.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { StudentResponseMapper } from "../../../../academic/students/infrastructure/mappers/StudentResponseMapper.js";
import { StudentResponseDto } from "../../../../academic/students/application/dto/StudentResponseDto.js";

import { isStudentEligibleForDrive } from "../../domain/services/isStudentEligibleForDrive.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * The real gate in Company -> Drive -> Eligibility Criteria ->
 * Eligible Students -> Student Applies -> Recruiter Reviews. Evaluates
 * a drive's real, structured eligibilityCriteria against real Student
 * records via isStudentEligibleForDrive - the exact same function
 * ApplyToPlacementUseCase uses to gate a real application, so this
 * admin-facing list and the actual apply gate can never drift apart.
 *
 * Fetches all of the organization's students once and filters
 * in-memory, the same pragmatic pattern already used for department-
 * name matching in BulkImportStudentsUseCase, rather than extending
 * IStudentRepository's filter shape (which only supports single exact-
 * match values, not the arrays/thresholds real eligibility needs) for
 * a single new consumer.
 */
export class GetEligibleStudentsUseCase {

    constructor(

        private readonly driveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        driveId: string,

        organizationId: string

    ): Promise<StudentResponseDto[]> {

        const drive =

            await this.driveRepository.findById(
                driveId
            );

        if (

            !drive ||
            drive.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Placement drive not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const allStudents =

            await this.studentRepository.findByOrganization(
                organizationId,
                {}
            );

        const eligible = allStudents.filter(

            student => isStudentEligibleForDrive(student, drive.eligibilityCriteria)

        );

        return eligible.map(
            student => StudentResponseMapper.toDto(student)
        );

    }

}
