import ActivitySubmission from "../models/ActivitySubmission.js";

import {

    SUBMISSION_STATUS,

} from "../constants/activityConstants.js";

import {

    NotFoundError,

} from "../../../shared/errors";

export default async function rejectSubmission(

    submissionId,

    feedback,

    user

){

    const submission = await ActivitySubmission.findById(

        submissionId

    );

    if(!submission){

        throw new NotFoundError(

            "Submission not found."

        );

    }

    submission.status=

        SUBMISSION_STATUS.REJECTED;

    submission.feedback=

        feedback || "";

    submission.reviewedBy=

        user.id;

    submission.reviewedAt=

        new Date();

    await submission.save();

    return{

        success:true,

        message:

            "Submission rejected.",

        submission,

    };

}