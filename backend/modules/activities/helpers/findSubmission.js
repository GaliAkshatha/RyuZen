import ActivitySubmission from "../models/ActivitySubmission.js";

import {

    NotFoundError,

} from "../../../shared/errors";

export default async function findSubmission(

    submissionId

){

    const submission =

        await ActivitySubmission.findOne({

            _id: submissionId,

            isDeleted:false,

        });

    if(!submission){

        throw new NotFoundError(

            "Submission not found."

        );

    }

    return submission;

}