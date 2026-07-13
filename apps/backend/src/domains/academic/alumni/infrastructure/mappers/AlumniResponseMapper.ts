import { Alumni } from "../../domain/entities/Alumni.js";

import { AlumniResponseDto } from "../../application/dto/AlumniResponseDto.js";

export class AlumniResponseMapper {

    static toDto(

        alumni: Alumni

    ): AlumniResponseDto {

        return {

            id:
                alumni.id!,

            organizationId:
                alumni.organizationId,

            userId:
                alumni.userId,

            email:
                alumni.email,

            name:
                alumni.name,

            graduationYear:
                alumni.graduationYear,

            company:
                alumni.company,

            designation:
                alumni.designation,

            isVerified:
                alumni.isVerified,

            status:
                alumni.status,

            createdAt:
                alumni.createdAt,

            updatedAt:
                alumni.updatedAt

        };

    }

}
