import { Education } from "../../domain/entities/Education.js";

import { EducationResponseDto } from "../../application/dto/EducationResponseDto.js";

export class EducationResponseMapper {

    static toDto(

        education: Education

    ): EducationResponseDto {

        return {

            id:
                education.id!,

            userId:
                education.userId,

            institution:
                education.institution,

            degree:
                education.degree,

            branch:
                education.branch,

            cgpa:
                education.cgpa,

            startYear:
                education.startYear,

            endYear:
                education.endYear,

            createdAt:
                education.createdAt,

            updatedAt:
                education.updatedAt

        };

    }

}
