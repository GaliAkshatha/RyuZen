import ActivitySubmission from "../models/ActivitySubmission.js";

import findActivity from "../helpers/findActivity.js";

import {

    ConflictError,

} from "../../../src/shared/errors.js";

export default async function submitActivity(

    activityId,

    submissionData,

    user

){

    await findActivity(

        activityId,

        user.organization

    );

    const exists = await ActivitySubmission.findOne({

        activity: activityId,

        student: user.id,

        isDeleted: false,

    });

    if(exists){

        throw new ConflictError(

            "Activity already submitted."

        );

    }

    const submission = await ActivitySubmission.create({

        activity: activityId,

        organization: user.organization,

        student: user.id,

        answers: submissionData.answers,

        attachment: submissionData.attachment,

    });

    return{

        success:true,

        message:"Submission successful.",

        submission,

    };

}