import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { User } from "../../../../identity/domain/entities/User.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";
import { UserStatus } from "../../../../identity/domain/constants/UserStatus.js";

import { Faculty } from "../../domain/entities/Faculty.js";
import { FacultyStatus } from "../../domain/constants/FacultyStatus.js";

import { Permission } from "../../../../platform/permissions/domain/constants/Permission.js";

import { IUserRepository } from "../../../../identity/infrastructure/repositories/IUserRepository.js";
import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";
import { IDepartmentRepository } from "../../../departments/infrastructure/repositories/IDepartmentRepository.js";

import { IPasswordHasher } from "../../../../identity/application/ports/IPasswordHasher.js";

import { CreateFacultyDto } from "../dto/CreateFacultyDto.js";
import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

export class CreateFacultyUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly facultyRepository: IFacultyRepository,

        private readonly departmentRepository: IDepartmentRepository,

        private readonly passwordHasher: IPasswordHasher

    ) {}

    async execute(

        dto: CreateFacultyDto

    ): Promise<FacultyResponseDto> {

        const department =

            await this.departmentRepository.findById(

                dto.departmentId

            );

        if (!department) {

            throw new ApiError(

                "Department not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const emailExists =

            await this.userRepository.existsByEmail(

                dto.email

            );

        if (emailExists) {

            throw new ApiError(

                "Email already exists.",

                HttpStatus.CONFLICT

            );

        }

        const employeeExists =

            await this.facultyRepository.existsByEmployeeId(

                dto.organizationId,

                dto.employeeId

            );

        if (employeeExists) {

            throw new ApiError(

                "Employee ID already exists.",

                HttpStatus.CONFLICT

            );

        }

        const passwordHash =

            await this.passwordHasher.hash(

                dto.password

            );

        const user = new User({

            organizationId: dto.organizationId,

            name: dto.name,

            email: dto.email,

            role: UserRole.FACULTY,

            permissions: [

                Permission.CREATE_ACTIVITY,

                Permission.UPDATE_ACTIVITY,

                Permission.REVIEW_SUBMISSION

            ],

            status: UserStatus.ACTIVE,

            joinedAt: new Date(),

            profile: {

                image: "",

                phone: "",

                bio: ""

            },

            auth: {

                passwordHash,

                emailVerified: true,

                failedAttempts: 0

            }

        });

        const createdUser =

            await this.userRepository.create(

                user

            );

        const faculty = new Faculty({

            userId: createdUser.id!,

            organizationId: dto.organizationId,

            departmentId: dto.departmentId,

            employeeId: dto.employeeId,

            designation: dto.designation,

            joiningDate: dto.joiningDate,

            status: FacultyStatus.ACTIVE

        });

        const createdFaculty =

            await this.facultyRepository.create(

                faculty

            );

        return {

            id: createdFaculty.id!,

            userId: createdUser.id!,

            organizationId: dto.organizationId,

            departmentId: dto.departmentId,

            name: createdUser.name,

            email: createdUser.email,

            employeeId: createdFaculty.employeeId,

            designation: createdFaculty.designation,

            joiningDate: createdFaculty.joiningDate,

            status: createdFaculty.status

        };

    }

}