import { Faculty } from "../../domain/entities/Faculty.js";

import { FacultyStatus } from "../../domain/constants/FacultyStatus.js";

import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";

import { FacultyResponseMapper } from "../../infrastructure/mappers/FacultyResponseMapper.js";

import { CreateFacultyDto } from "../dto/CreateFacultyDto.js";
import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    IDepartmentRepository,
} from "../../../departments/infrastructure/repositories/IDepartmentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateFacultyUseCase {

    constructor(

        private readonly repository: IFacultyRepository,

        private readonly userRepository: IUserRepository,

        private readonly departmentRepository: IDepartmentRepository

    ) {}

    async execute(

        dto: CreateFacultyDto,

        organizationId: string

    ): Promise<FacultyResponseDto> {

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

        if (user.role !== UserRole.FACULTY) {

            throw new ApiError(

                "User must have the FACULTY role.",

                HttpStatus.BAD_REQUEST

            );

        }

        const alreadyLinked =

            await this.repository.existsByUserId(
                dto.userId
            );

        if (alreadyLinked) {

            throw new ApiError(

                "A faculty record already exists for this user.",

                HttpStatus.CONFLICT

            );

        }

        const employeeIdTaken =

            await this.repository.existsByEmployeeId(

                organizationId,

                dto.employeeId

            );

        if (employeeIdTaken) {

            throw new ApiError(

                "A faculty member with this employee id already exists.",

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

        const faculty = Faculty.create({

            organizationId,

            userId:
                dto.userId,

            departmentId:
                dto.departmentId,

            employeeId:
                dto.employeeId,

            designation:
                dto.designation,

            specialization:
                dto.specialization,

            status:
                FacultyStatus.ACTIVE,

            joinedAt:
                new Date()

        });

        const created =

            await this.repository.create(

                faculty

            );

        return FacultyResponseMapper.toDto(

            created

        );

    }

}
