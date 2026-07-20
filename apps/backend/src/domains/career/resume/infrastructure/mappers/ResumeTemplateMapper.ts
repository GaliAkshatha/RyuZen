import { ResumeTemplate } from "../../domain/entities/ResumeTemplate.js";

import {
    ResumeTemplateDocument
} from "../persistence/ResumeTemplateModel.js";

export class ResumeTemplateMapper {

    static toDomain(

        document: ResumeTemplateDocument

    ): ResumeTemplate {

        return ResumeTemplate.create({

            id:
                document.id,

            name:
                document.name,

            thumbnail:
                document.thumbnail,

            templateFile:
                document.templateFile,

            premium:
                document.premium,

            createdAt:
                document.createdAt

        });

    }

    static toPersistence(

        template: ResumeTemplate

    ) {

        const data =
            template.toObject();

        return {

            name:
                data.name,

            thumbnail:
                data.thumbnail,

            templateFile:
                data.templateFile,

            premium:
                data.premium

        };

    }

}
