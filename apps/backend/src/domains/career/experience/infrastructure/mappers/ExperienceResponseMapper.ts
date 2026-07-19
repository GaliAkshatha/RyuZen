import { Experience } from "../../domain/entities/Experience.js";

import { ExperienceResponseDto } from "../../application/dto/ExperienceResponseDto.js";

export class ExperienceResponseMapper {

    static toDto(

        experience: Experience

    ): ExperienceResponseDto {

        return {

            id:
                experience.id!,

            userId:
                experience.userId,

            company:
                experience.company,

            role:
                experience.role,

            employmentType:
                experience.employmentType,

            location:
                experience.location,

            startDate:
                experience.startDate,

            endDate:
                experience.endDate,

            currentlyWorking:
                experience.currentlyWorking,

            description:
                experience.description,

            skills:
                experience.skills,

            createdAt:
                experience.createdAt,

            updatedAt:
                experience.updatedAt

        };

    }

}
