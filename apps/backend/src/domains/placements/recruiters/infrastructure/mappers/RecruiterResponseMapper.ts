import { Recruiter } from "../../domain/entities/Recruiter.js";

import { RecruiterResponseDto } from "../../application/dto/RecruiterResponseDto.js";

export class RecruiterResponseMapper {

    static toDto(

        recruiter: Recruiter

    ): RecruiterResponseDto {

        return {

            id:
                recruiter.id!,

            organizationId:
                recruiter.organizationId,

            userId:
                recruiter.userId,

            companyId:
                recruiter.companyId,

            jobTitle:
                recruiter.jobTitle,

            status:
                recruiter.status,

            createdAt:
                recruiter.createdAt

        };

    }

}
