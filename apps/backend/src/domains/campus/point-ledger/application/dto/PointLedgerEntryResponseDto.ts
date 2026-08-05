export interface PointLedgerEntryResponseDto {

    id: string;

    transactionId: string;

    studentId: string;

    activityId?: string;

    points: number;

    reason: string;

    timestamp: Date;

    previousHash: string;

    hash: string;

}
