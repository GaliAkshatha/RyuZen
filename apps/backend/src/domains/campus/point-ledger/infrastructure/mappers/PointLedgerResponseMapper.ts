import { PointLedgerEntry } from "../../domain/entities/PointLedgerEntry.js";

import { PointLedgerEntryResponseDto } from "../../application/dto/PointLedgerEntryResponseDto.js";

export class PointLedgerResponseMapper {

    static toDto(

        entry: PointLedgerEntry

    ): PointLedgerEntryResponseDto {

        return {

            id:
                entry.id!,

            transactionId:
                entry.transactionId,

            studentId:
                entry.studentId,

            activityId:
                entry.activityId,

            points:
                entry.points,

            reason:
                entry.reason,

            timestamp:
                entry.timestamp,

            previousHash:
                entry.previousHash,

            hash:
                entry.hash

        };

    }

}
