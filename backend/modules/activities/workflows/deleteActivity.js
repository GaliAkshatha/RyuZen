import Activity from "../models/Activity.js";

import {

    NotFoundError,

} from "../../../shared/errors";

export default async function deleteActivity(

    activityId,

    user

){

    const activity = await Activity.findOne({

        _id:activityId,

        organization:user.organization,

        isDeleted:false,

    });

    if(!activity){

        throw new NotFoundError(

            "Activity not found."

        );

    }

    activity.isDeleted=true;

    activity.updatedBy=user.id;

    await activity.save();

    return{

        success:true,

        message:

            "Activity deleted successfully."

    };

}