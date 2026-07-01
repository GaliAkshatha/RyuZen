import Activity from "../models/Activity.js";

import {

    ACTIVITY_STATUS,

} from "../constants/activityConstants.js";

import {

    NotFoundError,

    BadRequestError,

} from "../../../shared/errors";

import findActivity from "../helpers/findActivity.js";

export default async function closeActivity(

    activityId,

    user

){

    const activity = await findActivity(
        activityId,
        user.organization
    );

    if(!activity){

        throw new NotFoundError(

            "Activity not found."

        );

    }

    if(

        activity.status===

        ACTIVITY_STATUS.CLOSED

    ){

        throw new BadRequestError(

            "Activity already closed."

        );

    }

    activity.status=

        ACTIVITY_STATUS.CLOSED;

    activity.closedAt=

        new Date();

    activity.updatedBy=

        user.id;

    await activity.save();

    return{

        success:true,

        message:

            "Activity closed successfully.",

        activity,

    };

}