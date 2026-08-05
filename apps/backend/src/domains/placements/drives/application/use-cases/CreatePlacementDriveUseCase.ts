import { PlacementDrive } from "../../domain/entities/PlacementDrive.js";

import { PlacementDriveStatus } from "../../domain/constants/PlacementDriveStatus.js";

import { IPlacementDriveRepository } from "../../infrastructure/repositories/IPlacementDriveRepository.js";

import { PlacementDriveResponseMapper } from "../../infrastructure/mappers/PlacementDriveResponseMapper.js";

import { CreatePlacementDriveDto } from "../dto/CreatePlacementDriveDto.js";
import { PlacementDriveResponseDto } from "../dto/PlacementDriveResponseDto.js";

import {
    ICompanyRepository,
} from "../../../companies/infrastructure/repositories/ICompanyRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreatePlacementDriveUseCase {

    constructor(

        private readonly repository: IPlacementDriveRepository,

        private readonly companyRepository: ICompanyRepository

    ) {}

    async execute(

        dto: CreatePlacementDriveDto,

        organizationId: string

    ): Promise<PlacementDriveResponseDto> {

        const company =

            await this.companyRepository.findById(
                dto.companyId
            );

        if (

            !company ||
            company.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Company not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const drive = PlacementDrive.create({

            organizationId,

            companyId:
                dto.companyId,

            title:
                dto.title,

            description:
                dto.description,

            package:
                dto.package,

            location:
                dto.location,

            eligibility:
                dto.eligibility,

            eligibilityCriteria:
                dto.eligibilityCriteria,

            deadline:
                dto.deadline,

            status:
                PlacementDriveStatus.DRAFT

        });

        const created =

            await this.repository.create(

                drive

            );

        return PlacementDriveResponseMapper.toDto(

            created

        );

    }

}
