export interface CreateCertificationDto {

    title: string;

    issuer: string;

    credentialId?: string;

    issueDate: Date;

    expiryDate?: Date;

    credentialUrl?: string;

    fileUrl?: string;

    skills?: string[];

}
