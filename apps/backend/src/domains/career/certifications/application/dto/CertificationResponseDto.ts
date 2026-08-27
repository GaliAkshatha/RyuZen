export interface CertificationResponseDto {

    id: string;

    userId: string;

    title: string;

    issuer: string;

    credentialId?: string;

    issueDate: Date;

    expiryDate?: Date;

    credentialUrl?: string;

    fileUrl?: string;

    skills: string[];

    verified: boolean;

    verifiedBy?: string;

    verifiedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
