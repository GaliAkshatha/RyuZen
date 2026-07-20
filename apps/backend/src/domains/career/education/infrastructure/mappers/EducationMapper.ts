import { Education } from "../../domain/entities/Education.js";

import {
    EducationDocument
} from "../persistence/EducationModel.js";

export class EducationMapper {

    static toDomain(

        document: EducationDocument

    ): Education {

        return Education.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            institution:
                document.institution,

            degree:
                document.degree,

            branch:
                document.branch,

            cgpa:
                document.cgpa,

            startYear:
                document.startYear,

            endYear:
                document.endYear,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        education: Education

    ) {

        const data =
            education.toObject();

        return {

            userId:
                data.userId,

            institution:
                data.institution,

            degree:
                data.degree,

            branch:
                data.branch,

            cgpa:
                data.cgpa,

            startYear:
                data.startYear,

            endYear:
                data.endYear

        };

    }

}
