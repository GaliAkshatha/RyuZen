import Activity from "../models/Activity.js";

import {

    NotFoundError,

} from "../../../shared/errors";
import findActivity from "../helpers/findActivity.js";

export default async function deleteActivity(

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

    activity.isDeleted=true;

    activity.updatedBy=user.id;

    await activity.save();

    return{

        success:true,

        message:

            "Activity deleted successfully."

    };

}