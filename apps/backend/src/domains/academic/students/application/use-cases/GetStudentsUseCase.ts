import { IStudentRepository } from "../../infrastructure/repositories/IStudentRepository.js";

import { StudentResponseMapper } from "../../infrastructure/mappers/StudentResponseMapper.js";

import { StudentResponseDto } from "../dto/StudentResponseDto.js";

export interface GetStudentsFilterDto {

    departmentId?: string;

    batch?: string;

    semester?: number;

}

export class GetStudentsUseCase {

    constructor(

        private readonly repository: IStudentRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetStudentsFilterDto

    ): Promise<StudentResponseDto[]> {

        const students =

            await this.repository.findByOrganization(

                organizationId,

                {

                    departmentId: filters.departmentId,

                    batch: filters.batch,

                    semester: filters.semester

                }

            );

        return students.map(

            student =>

                StudentResponseMapper.toDto(
                    student
                )

        );

    }

}
