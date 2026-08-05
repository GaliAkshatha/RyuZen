import { PointLedgerEntry } from "../../domain/entities/PointLedgerEntry.js";

import { PointLedgerModel } from "../persistence/PointLedgerModel.js";

import { PointLedgerMapper } from "../mappers/PointLedgerMapper.js";

import { IPointLedgerRepository } from "./IPointLedgerRepository.js";

export class PointLedgerRepository
implements IPointLedgerRepository {

    async create(

        entry: PointLedgerEntry

    ): Promise<PointLedgerEntry> {

        const document =
            await PointLedgerModel.create(

                PointLedgerMapper.toPersistence(
                    entry
                )

            );

        return PointLedgerMapper.toDomain(
            document
        );

    }

    async findLatestForOrganization(

        organizationId: string

    ): Promise<PointLedgerEntry | null> {

        const document =
            await PointLedgerModel
                .findOne({ organizationId })
                .sort({ timestamp: -1 });

        return document
            ? PointLedgerMapper.toDomain(document)
            : null;

    }

    async findByStudentId(

        organizationId: string,

        studentId: string

    ): Promise<PointLedgerEntry[]> {

        const documents =
            await PointLedgerModel
                .find({ organizationId, studentId })
                .sort({ timestamp: -1 });

        return documents.map(
            document => PointLedgerMapper.toDomain(document)
        );

    }

    async findAllForOrganization(

        organizationId: string

    ): Promise<PointLedgerEntry[]> {

        const documents =
            await PointLedgerModel
                .find({ organizationId })
                .sort({ timestamp: 1 });

        return documents.map(
            document => PointLedgerMapper.toDomain(document)
        );

    }

}
