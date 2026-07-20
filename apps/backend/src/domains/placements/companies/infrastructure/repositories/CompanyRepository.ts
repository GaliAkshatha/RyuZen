import { Company } from "../../domain/entities/Company.js";

import { CompanyModel } from "../persistence/CompanyModel.js";

import { CompanyMapper } from "../mappers/CompanyMapper.js";

import { ICompanyRepository } from "./ICompanyRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class CompanyRepository extends BaseRepository<Company>
implements ICompanyRepository {

    async create(

        company: Company

    ): Promise<Company> {

        const document =

            await CompanyModel.create(

                CompanyMapper.toPersistence(

                    company

                )

            );

        return CompanyMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Company | null> {

        const document =

            await CompanyModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return CompanyMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string

    ): Promise<Company[]> {

        const documents =

            await CompanyModel.find({

                organizationId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                CompanyMapper.toDomain(
                    document
                )

        );

    }

    async existsByName(

        organizationId: string,

        name: string

    ): Promise<boolean> {

        const document =

            await CompanyModel.findOne({

                organizationId,

                name

            });

        return !!document;

    }

    async save(

        company: Company

    ): Promise<Company> {

        const document =

            await CompanyModel.findByIdAndUpdate(

                company.id,

                CompanyMapper.toPersistence(

                    company

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Company not found."

            );

        }

        return CompanyMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await CompanyModel.findByIdAndDelete(

            id

        );

    }

}
