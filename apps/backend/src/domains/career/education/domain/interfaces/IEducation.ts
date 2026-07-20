export interface IEducation {

    id?: string;

    userId: string;

    institution: string;

    degree: string;

    branch?: string;

    cgpa?: number;

    startYear: number;

    endYear?: number;

    createdAt?: Date;

    updatedAt?: Date;

}
