import findSubmission from "../helpers/findSubmission.js";

import {

    SUBMISSION_STATUS,

} from "../constants/activityConstants.js";

export default async function markAttendance(

    submissionId,

    user

){

    const submission =

        await findSubmission(

            submissionId

        );

    submission.status =

        SUBMISSION_STATUS.COMPLETED;

    submission.reviewedBy =

        user.id;

    submission.reviewedAt =

        new Date();

    await submission.save();

    return{

        success:true,

        message:

            "Attendance marked.",

        submission,

    };

}