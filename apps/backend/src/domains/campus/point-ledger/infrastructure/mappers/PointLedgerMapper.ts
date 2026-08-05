import { PointLedgerEntry } from "../../domain/entities/PointLedgerEntry.js";

import { PointLedgerDocument } from "../persistence/PointLedgerModel.js";

export class PointLedgerMapper {

    static toDomain(

        document: PointLedgerDocument

    ): PointLedgerEntry {

        return PointLedgerEntry.fromPersisted({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            transactionId:
                document.transactionId,

            studentId:
                document.studentId.toString(),

            activityId:
                document.activityId?.toString(),

            points:
                document.points,

            reason:
                document.reason,

            timestamp:
                document.timestamp,

            previousHash:
                document.previousHash,

            hash:
                document.hash

        });

    }

    static toPersistence(

        entry: PointLedgerEntry

    ) {

        const data =
            entry.toObject();

        return {

            organizationId:
                data.organizationId,

            transactionId:
                data.transactionId,

            studentId:
                data.studentId,

            activityId:
                data.activityId,

            points:
                data.points,

            reason:
                data.reason,

            timestamp:
                data.timestamp,

            previousHash:
                data.previousHash,

            hash:
                data.hash

        };

    }

}
