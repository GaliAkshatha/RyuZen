export interface CreatePlacementDriveDto {

    companyId: string;

    title: string;

    description?: string;

    package?: string;

    location?: string;

    eligibility?: string;

    eligibilityCriteria?: {

        departmentIds?: string[];

        minCgpa?: number;

        minSemester?: number;

        batches?: string[];

    };

    deadline?: Date;

}
