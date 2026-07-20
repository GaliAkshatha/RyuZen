import { Resume } from "../../domain/entities/Resume.js";

import { ResumeVisibility } from "../../domain/constants/ResumeVisibility.js";

import {
    ResumeDocument
} from "../persistence/ResumeModel.js";

export class ResumeMapper {

    static toDomain(

        document: ResumeDocument

    ): Resume {

        return Resume.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            selectedTemplate:
                document.selectedTemplate?.toString(),

            resumeUrl:
                document.resumeUrl,

            lastGeneratedAt:
                document.lastGeneratedAt,

            atsScore:
                document.atsScore,

            visibility:
                document.visibility as ResumeVisibility,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        resume: Resume

    ) {

        const data =
            resume.toObject();

        return {

            userId:
                data.userId,

            selectedTemplate:
                data.selectedTemplate,

            resumeUrl:
                data.resumeUrl,

            lastGeneratedAt:
                data.lastGeneratedAt,

            atsScore:
                data.atsScore,

            visibility:
                data.visibility

        };

    }

}
