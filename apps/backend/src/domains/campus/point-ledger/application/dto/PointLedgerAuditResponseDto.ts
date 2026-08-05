import { PointLedgerEntryResponseDto } from "./PointLedgerEntryResponseDto.js";

export interface PointLedgerAuditResponseDto {

    entries: PointLedgerEntryResponseDto[];

    /** True only if every entry's stored hash matches an independent recomputation AND correctly chains to the previous entry. */
    isValid: boolean;

    /** The first transaction where verification failed, if any - the point past which the chain can no longer be trusted. */
    brokenAtTransactionId?: string;

}
