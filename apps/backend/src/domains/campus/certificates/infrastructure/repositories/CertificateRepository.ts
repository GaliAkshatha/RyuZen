import { Certificate } from "../../domain/entities/Certificate.js";

import { CertificateModel } from "../persistence/CertificateModel.js";

import { CertificateMapper } from "../mappers/CertificateMapper.js";

import { ICertificateRepository } from "./ICertificateRepository.js";

export class CertificateRepository
implements ICertificateRepository {

    async create(

        certificate: Certificate

    ): Promise<Certificate> {

        const document =

            await CertificateModel.create(

                CertificateMapper.toPersistence(

                    certificate

                )

            );

        return CertificateMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Certificate | null> {

        const document =

            await CertificateModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return CertificateMapper.toDomain(

            document

        );

    }

    async findByStudent(

        studentId: string

    ): Promise<Certificate[]> {

        const documents =

            await CertificateModel.find({

                studentId

            })

                .sort({

                    issuedAt: -1

                });

        return documents.map(

            document =>

                CertificateMapper.toDomain(
                    document
                )

        );

    }

    async findByStudentIds(

        studentIds: string[]

    ): Promise<Certificate[]> {

        const documents =

            await CertificateModel.find({

                studentId: { $in: studentIds }

            });

        return documents.map(

            document =>

                CertificateMapper.toDomain(
                    document
                )

        );

    }

}
