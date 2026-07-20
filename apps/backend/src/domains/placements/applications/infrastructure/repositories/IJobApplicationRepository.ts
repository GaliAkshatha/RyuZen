import { JobApplication } from "../../domain/entities/JobApplication.js";

export interface IJobApplicationRepository {

    create(
        application: JobApplication
    ): Promise<JobApplication>;

    findById(
        id: string
    ): Promise<JobApplication | null>;

    findByPlacement(
        placementId: string
    ): Promise<JobApplication[]>;

    findByStudent(
        studentId: string
    ): Promise<JobApplication[]>;

    existsByPlacementAndStudent(
        placementId: string,
        studentId: string
    ): Promise<boolean>;

    save(
        application: JobApplication
    ): Promise<JobApplication>;

}
