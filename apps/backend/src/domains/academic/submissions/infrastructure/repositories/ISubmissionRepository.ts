import { Submission } from "../../domain/entities/Submission.js";

import { SubmissionFilter } from "../../application/dto/SubmissionFilter.js";

export interface ISubmissionRepository {

    create(

        submission: Submission

    ): Promise<Submission>;

    findById(

        id: string

    ): Promise<Submission | null>;

    findAll(

        filter: SubmissionFilter

    ): Promise<Submission[]>;

    save(

        submission: Submission

    ): Promise<Submission>;

    delete(

        id: string

    ): Promise<void>;

}