import { Certificate } from "../../domain/entities/Certificate.js";

import {
    CertificateDocument
} from "../persistence/CertificateModel.js";

export class CertificateMapper {

    static toDomain(

        document: CertificateDocument

    ): Certificate {

        return Certificate.create({

            id:
                document.id,

            studentId:
                document.studentId.toString(),

            eventId:
                document.eventId?.toString(),

            activityId:
                document.activityId?.toString(),

            certificateUrl:
                document.certificateUrl,

            issuedAt:
                document.issuedAt

        });

    }

    static toPersistence(

        certificate: Certificate

    ) {

        const data =
            certificate.toObject();

        return {

            studentId:
                data.studentId,

            eventId:
                data.eventId,

            activityId:
                data.activityId,

            certificateUrl:
                data.certificateUrl,

            issuedAt:
                data.issuedAt

        };

    }

}
