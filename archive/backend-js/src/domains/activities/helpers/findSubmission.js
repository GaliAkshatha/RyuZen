import ActivitySubmission from "../models/ActivitySubmission.js";

import {

    NotFoundError,

} from "../../../src/shared/errors.js";

import applySession from "../../../shared/database/applySession.js";

export default async function findSubmission(

    submissionId,

    session = null

){

    const submission = await applySession(

        ActivitySubmission.findOne({

            _id: submissionId,

            isDeleted:false,

        }),

        session

    );

    if(!submission){

        throw new NotFoundError(

            "Submission not found."

        );

    }

    return submission;

}