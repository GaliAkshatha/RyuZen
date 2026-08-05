import { Student } from "../../domain/entities/Student.js";

import { StudentStatus } from "../../domain/constants/StudentStatus.js";

import { IStudentRepository } from "../../infrastructure/repositories/IStudentRepository.js";

import { StudentResponseMapper } from "../../infrastructure/mappers/StudentResponseMapper.js";

import { CreateStudentDto } from "../dto/CreateStudentDto.js";
import { StudentResponseDto } from "../dto/StudentResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    IDepartmentRepository,
} from "../../../departments/infrastructure/repositories/IDepartmentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateStudentUseCase {

    constructor(

        private readonly repository: IStudentRepository,

        private readonly userRepository: IUserRepository,

        private readonly departmentRepository: IDepartmentRepository

    ) {}

    async execute(

        dto: CreateStudentDto,

        organizationId: string

    ): Promise<StudentResponseDto> {

        const user =

            await this.userRepository.findById(
                dto.userId
            );

        if (

            !user ||
            user.organizationId !== organizationId

        ) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (user.role !== UserRole.STUDENT) {

            throw new ApiError(

                "User must have the STUDENT role.",

                HttpStatus.BAD_REQUEST

            );

        }

        const alreadyLinked =

            await this.repository.existsByUserId(
                dto.userId
            );

        if (alreadyLinked) {

            throw new ApiError(

                "A student record already exists for this user.",

                HttpStatus.CONFLICT

            );

        }

        const usnTaken =

            await this.repository.existsByUsn(

                organizationId,

                dto.usn

            );

        if (usnTaken) {

            throw new ApiError(

                "A student with this USN already exists.",

                HttpStatus.CONFLICT

            );

        }

        if (dto.departmentId) {

            const department =

                await this.departmentRepository.findById(
                    dto.departmentId
                );

            if (

                !department ||
                department.organizationId !== organizationId

            ) {

                throw new ApiError(

                    "Department not found.",

                    HttpStatus.NOT_FOUND

                );

            }

        }

        const student = Student.create({

            organizationId,

            userId:
                dto.userId,

            departmentId:
                dto.departmentId,

            usn:
                dto.usn,

            batch:
                dto.batch,

            semester:
                dto.semester ?? 1,

            cgpa:
                dto.cgpa,

            section:
                dto.section,

            admissionYear:
                dto.admissionYear,

            graduationYear:
                dto.graduationYear,

            tenthPercentage:
                dto.tenthPercentage,

            twelfthPercentage:
                dto.twelfthPercentage,

            entranceRank:
                dto.entranceRank,

            status:
                StudentStatus.ACTIVE,

            joinedAt:
                new Date()

        });

        const created =

            await this.repository.create(

                student

            );

        return StudentResponseMapper.toDto(

            created

        );

    }

}
