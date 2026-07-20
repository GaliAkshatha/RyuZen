export interface UpdateCertificationDto {

    title?: string;

    issuer?: string;

    credentialId?: string;

    issueDate?: Date;

    expiryDate?: Date;

    credentialUrl?: string;

    skills?: string[];

}
