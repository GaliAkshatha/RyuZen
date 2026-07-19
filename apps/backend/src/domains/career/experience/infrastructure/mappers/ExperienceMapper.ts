import { Experience } from "../../domain/entities/Experience.js";

import { EmploymentType } from "../../domain/constants/EmploymentType.js";

import {
    ExperienceDocument
} from "../persistence/ExperienceModel.js";

export class ExperienceMapper {

    static toDomain(

        document: ExperienceDocument

    ): Experience {

        return Experience.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            company:
                document.company,

            role:
                document.role,

            employmentType:
                document.employmentType as EmploymentType | undefined,

            location:
                document.location,

            startDate:
                document.startDate,

            endDate:
                document.endDate,

            currentlyWorking:
                document.currentlyWorking,

            description:
                document.description,

            skills:
                [...(document.skills ?? [])],

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        experience: Experience

    ) {

        const data =
            experience.toObject();

        return {

            userId:
                data.userId,

            company:
                data.company,

            role:
                data.role,

            employmentType:
                data.employmentType,

            location:
                data.location,

            startDate:
                data.startDate,

            endDate:
                data.endDate,

            currentlyWorking:
                data.currentlyWorking,

            description:
                data.description,

            skills:
                data.skills

        };

    }

}
