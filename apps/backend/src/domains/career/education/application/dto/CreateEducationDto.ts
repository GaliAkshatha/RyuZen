export interface CreateEducationDto {

    institution: string;

    degree: string;

    branch?: string;

    cgpa?: number;

    startYear: number;

    endYear?: number;

}
