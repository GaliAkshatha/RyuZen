import { Certificate } from "../../domain/entities/Certificate.js";

import { CertificateResponseDto } from "../../application/dto/CertificateResponseDto.js";

export class CertificateResponseMapper {

    static toDto(

        certificate: Certificate

    ): CertificateResponseDto {

        return {

            id:
                certificate.id!,

            studentId:
                certificate.studentId,

            eventId:
                certificate.eventId,

            activityId:
                certificate.activityId,

            certificateUrl:
                certificate.certificateUrl,

            issuedAt:
                certificate.issuedAt

        };

    }

}
