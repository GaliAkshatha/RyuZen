import { IOrganizationRepository } from "./IOrganizationRepository.js";

import { OrganizationModel } from "../persistence/OrganizationModel.js";
import { OrganizationMapper } from "../mappers/OrganizationMapper.js";

import { Organization } from "../../domain/entities/Organization.js";

export class OrganizationRepository
    implements IOrganizationRepository {

    async create(
        organization: Organization
    ): Promise<Organization> {

        const persistence =

            OrganizationMapper.toPersistence(
                organization
            );

        const document =

            await OrganizationModel.create(
                persistence
            );

        return OrganizationMapper.toDomain(
            document
        );

    }

    async findById(
        id: string
    ): Promise<Organization | null> {

        const document =

            await OrganizationModel.findById(
                id
            );

        if (!document) {

            return null;

        }

        return OrganizationMapper.toDomain(
            document
        );

    }

    async findByCode(
        code: string
    ): Promise<Organization | null> {

        const document =

            await OrganizationModel.findOne({

                code

            });

        if (!document) {

            return null;

        }

        return OrganizationMapper.toDomain(
            document
        );

    }

    async findAll(): Promise<Organization[]> {

        const documents =

            await OrganizationModel.find()

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                OrganizationMapper.toDomain(
                    document
                )

        );

    }

    async existsByCode(
        code: string
    ): Promise<boolean> {

        return (

            await OrganizationModel.exists({

                code

            })

        ) !== null;

    }

}