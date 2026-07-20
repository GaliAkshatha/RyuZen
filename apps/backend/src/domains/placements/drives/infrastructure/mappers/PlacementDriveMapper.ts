import { PlacementDrive } from "../../domain/entities/PlacementDrive.js";

import { PlacementDriveStatus } from "../../domain/constants/PlacementDriveStatus.js";

import {
    PlacementDriveDocument
} from "../persistence/PlacementDriveModel.js";

export class PlacementDriveMapper {

    static toDomain(

        document: PlacementDriveDocument

    ): PlacementDrive {

        return PlacementDrive.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            companyId:
                document.companyId.toString(),

            title:
                document.title,

            description:
                document.description,

            package:
                document.package,

            location:
                document.location,

            eligibility:
                document.eligibility,

            deadline:
                document.deadline,

            status:
                document.status as PlacementDriveStatus,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        drive: PlacementDrive

    ) {

        const data =
            drive.toObject();

        return {

            organizationId:
                data.organizationId,

            companyId:
                data.companyId,

            title:
                data.title,

            description:
                data.description,

            package:
                data.package,

            location:
                data.location,

            eligibility:
                data.eligibility,

            deadline:
                data.deadline,

            status:
                data.status

        };

    }

}
