import { PlacementDrive } from "../../domain/entities/PlacementDrive.js";

import { PlacementDriveResponseDto } from "../../application/dto/PlacementDriveResponseDto.js";

export class PlacementDriveResponseMapper {

    static toDto(

        drive: PlacementDrive

    ): PlacementDriveResponseDto {

        return {

            id:
                drive.id!,

            organizationId:
                drive.organizationId,

            companyId:
                drive.companyId,

            title:
                drive.title,

            description:
                drive.description,

            package:
                drive.package,

            location:
                drive.location,

            eligibility:
                drive.eligibility,

            deadline:
                drive.deadline,

            status:
                drive.status,

            createdAt:
                drive.createdAt,

            updatedAt:
                drive.updatedAt

        };

    }

}
