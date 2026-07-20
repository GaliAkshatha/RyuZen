import { Certification } from "../../domain/entities/Certification.js";

import {
    CertificationDocument
} from "../persistence/CertificationModel.js";

export class CertificationMapper {

    static toDomain(

        document: CertificationDocument

    ): Certification {

        return Certification.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            title:
                document.title,

            issuer:
                document.issuer,

            credentialId:
                document.credentialId,

            issueDate:
                document.issueDate,

            expiryDate:
                document.expiryDate,

            credentialUrl:
                document.credentialUrl,

            skills:
                [...(document.skills ?? [])],

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        certification: Certification

    ) {

        const data =
            certification.toObject();

        return {

            userId:
                data.userId,

            title:
                data.title,

            issuer:
                data.issuer,

            credentialId:
                data.credentialId,

            issueDate:
                data.issueDate,

            expiryDate:
                data.expiryDate,

            credentialUrl:
                data.credentialUrl,

            skills:
                data.skills

        };

    }

}
