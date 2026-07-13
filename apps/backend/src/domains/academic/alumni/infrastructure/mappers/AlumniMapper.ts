import { Alumni } from "../../domain/entities/Alumni.js";

import { AlumniStatus } from "../../domain/constants/AlumniStatus.js";

import {
    AlumniDocument
} from "../persistence/AlumniModel.js";

export class AlumniMapper {

    static toDomain(

        document: AlumniDocument

    ): Alumni {

        return Alumni.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            userId:
                document.userId?.toString(),

            email:
                document.email,

            name:
                document.name,

            graduationYear:
                document.graduationYear,

            company:
                document.company,

            designation:
                document.designation,

            isVerified:
                document.isVerified,

            status:
                document.status as AlumniStatus,

            inviteTokenHash:
                document.inviteTokenHash,

            inviteExpiresAt:
                document.inviteExpiresAt,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        alumni: Alumni

    ) {

        const data =
            alumni.toObject();

        return {

            organizationId:
                data.organizationId,

            userId:
                data.userId,

            email:
                data.email,

            name:
                data.name,

            graduationYear:
                data.graduationYear,

            company:
                data.company,

            designation:
                data.designation,

            isVerified:
                data.isVerified,

            status:
                data.status,

            inviteTokenHash:
                data.inviteTokenHash,

            inviteExpiresAt:
                data.inviteExpiresAt

        };

    }

}
