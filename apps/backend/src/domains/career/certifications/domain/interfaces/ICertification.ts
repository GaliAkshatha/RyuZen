export interface ICertification {

    id?: string;

    userId: string;

    title: string;

    issuer: string;

    credentialId?: string;

    issueDate: Date;

    expiryDate?: Date;

    credentialUrl?: string;

    skills: string[];

    createdAt?: Date;

    updatedAt?: Date;

}
