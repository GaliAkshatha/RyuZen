import ActivitySubmission from "../models/ActivitySubmission.js";

import {

    SUBMISSION_STATUS,

} from "../constants/activityConstants.js";

import {

    NotFoundError,

    BadRequestError,

} from "../../../shared/errors";

export default async function approveSubmission(

    submissionId,

    feedback,

    score,

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

    if(

        submission.status===

        SUBMISSION_STATUS.APPROVED

    ){

        throw new BadRequestError(

            "Submission already approved."

        );

    }

    submission.status=

        SUBMISSION_STATUS.APPROVED;

    submission.feedback=

        feedback || "";

    submission.score=

        score || 0;

    submission.reviewedBy=

        user.id;

    submission.reviewedAt=

        new Date();

    await submission.save();

    return{

        success:true,

        message:

            "Submission approved.",

        submission,

    };

}