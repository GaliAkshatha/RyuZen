export interface ICertification {

    id?: string;

    userId: string;

    title: string;

    issuer: string;

    credentialId?: string;

    issueDate: Date;

    expiryDate?: Date;

    /** An external verification link (e.g. a Coursera/LinkedIn Learning verify URL) - distinct from fileUrl below. */
    credentialUrl?: string;

    /** A real uploaded document (PDF/image) stored on this server - the actual proof, not just a link to an external service. */
    fileUrl?: string;

    skills: string[];

    /** False until a real Faculty/Org Admin/Super Admin explicitly verifies this - matches the exact same verified/verifiedBy/verifiedAt shape as Skill. */
    verified: boolean;

    verifiedBy?: string;

    verifiedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
