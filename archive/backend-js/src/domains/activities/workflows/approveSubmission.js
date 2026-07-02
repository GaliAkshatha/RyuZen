import mongoose from "mongoose";

import User from "../../users/models/User.js";

import Notification from "../../notifications/models/Notification.js";

import findSubmission from "../helpers/findSubmission.js";

import findActivity from "../helpers/findActivity.js";

import {

SUBMISSION_STATUS,

}

from "../constants/activityConstants.js";

export default async function approveSubmission(
    submissionId,

    feedback,

    score,

    user
){

    const session =

        await mongoose.startSession();

    session.startTransaction();

    try{

        const submission =

            await findSubmission(

                submissionId,

                session

            );

        const activity =

            await findActivity(

                submission.activity,

                submission.organization,

                session

            );

            await User.findByIdAndUpdate(

                submission.student,

            {

                $inc:{

                    academicPoints:

                        activity.rules.points,

                },

            },

            {

                session,

            }

        );

        submission.status=

            SUBMISSION_STATUS.APPROVED;

        submission.feedback=

            feedback;

        submission.score=

            score;

        submission.reviewedBy=

            user.id;

        submission.reviewedAt=

            new Date();

        await submission.save({

            session,

        });

        activity.statistics.completed++;

            await activity.save({

                session,

            });

            await Notification.create([

                {

                    user:

                        submission.student,

                    title:

                        "Activity Approved",

                    message:

                        `${activity.title} approved.`,

                }

            ],{

                session,

            });

            await session.commitTransaction();

            return{

                success:true,

                message:

                    "Submission approved.",

                submission,

            };

    }

    catch(error){

        await session.abortTransaction();

        throw error;

    }

    finally{

        session.endSession();

    }

}