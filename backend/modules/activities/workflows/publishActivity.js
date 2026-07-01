import Activity from "../models/Activity.js";

import {
    ACTIVITY_STATUS,
} from "../constants/activityConstants.js";

import {
    NotFoundError,
    BadRequestError,
} from "../../../shared/errors";

export default async function publishActivity(

    activityId,

    user

){

    const activity = await Activity.findOne({

        _id: activityId,

        organization:user.organization,

        isDeleted:false,

    });

    if(!activity){

        throw new NotFoundError(

            "Activity not found."

        );

    }

    if(

        activity.status !==

        ACTIVITY_STATUS.DRAFT

    ){

        throw new BadRequestError(

            "Only draft activities can be published."

        );

    }

    activity.status =

        ACTIVITY_STATUS.PUBLISHED;

    activity.publishedAt =

        new Date();

    activity.updatedBy =

        user.id;

    await activity.save();

    return{

        success:true,

        message:

            "Activity published successfully.",

        activity,

    };

}